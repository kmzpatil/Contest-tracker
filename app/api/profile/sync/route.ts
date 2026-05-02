import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getDb } from '@/lib/mongodb';
import { syncProfileForHandle, type StoredProfile } from '@/lib/profileSync';

export async function POST(request: Request) {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: { handle?: string } = {};
  try {
    body = (await request.json()) as { handle?: string };
  } catch {
    body = {};
  }

  const db = await getDb();
  const existing = await db
    .collection<StoredProfile>('user_profiles')
    .findOne({ userId: session.user.id });

  const handle = body.handle?.trim() || existing?.handle;
  if (!handle) {
    return NextResponse.json(
      { error: 'No handle found. Add your handle first in Profile.' },
      { status: 400 },
    );
  }

  try {
    const synced = await syncProfileForHandle(handle);

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
