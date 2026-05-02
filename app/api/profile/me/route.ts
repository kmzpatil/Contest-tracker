import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getDb } from '@/lib/mongodb';
import { sanitizeStoredProfile, syncProfileForHandle, type StoredProfile } from '@/lib/profileSync';

export async function GET() {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const db = await getDb();
  const doc = await db
    .collection<StoredProfile>('user_profiles')
    .findOne({ userId: session.user.id });

  return NextResponse.json({ profile: sanitizeStoredProfile(doc) });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: { handle?: string };
  try {
    body = (await request.json()) as { handle?: string };
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const handle = body.handle?.trim();
  if (!handle) {
    return NextResponse.json({ error: 'Handle is required' }, { status: 400 });
  }

  try {
    const synced = await syncProfileForHandle(handle);

    const db = await getDb();
    const profile: StoredProfile = {
      userId: session.user.id,
      email: session.user.email,
      name: session.user.name,
      ...synced,
    };

    await db.collection<StoredProfile>('user_profiles').updateOne(
      { userId: session.user.id },
      { $set: profile },
      { upsert: true },
    );

    return NextResponse.json({ profile });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to sync profile';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
