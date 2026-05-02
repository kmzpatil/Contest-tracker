import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getDb } from '@/lib/mongodb';

export async function GET(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const contestId = searchParams.get('contestId');

  try {
    const db = await getDb();
    const alarms = db.collection('alarms');

    const query: Record<string, unknown> = { userId: session.user.id };
    if (contestId) query.contestId = contestId;

    const userAlarms = await alarms.find(query).sort({ remindAt: 1 }).toArray();
    return NextResponse.json({ alarms: userAlarms });
  } catch (error) {
    console.error('Alarms fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch alarms' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { contestId, contestName, platform, contestUrl, startTime, remindBefore } = await request.json();

    if (!contestId || !contestName || !startTime || !remindBefore) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const contestStart = new Date(startTime).getTime();
    const remindAt = new Date(contestStart - remindBefore * 60_000);

    if (remindAt.getTime() < Date.now()) {
      return NextResponse.json({ error: 'Reminder time is in the past' }, { status: 400 });
    }

    const db = await getDb();
    const alarms = db.collection('alarms');

    // Prevent duplicate alarms for same contest + user
    const existing = await alarms.findOne({
      userId: session.user.id,
      contestId,
    });

    if (existing) {
      // Update existing alarm
      await alarms.updateOne(
        { _id: existing._id },
        { $set: { remindAt, remindBefore, updatedAt: new Date() } }
      );
      return NextResponse.json({ success: true, updated: true });
    }

    await alarms.insertOne({
      userId: session.user.id,
      contestId,
      contestName,
      platform: platform || 'other',
      contestUrl: contestUrl || '',
      startTime: new Date(startTime),
      remindAt,
      remindBefore,
      createdAt: new Date(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Alarm create error:', error);
    return NextResponse.json({ error: 'Failed to create alarm' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const alarmId = searchParams.get('id');

    if (!alarmId) {
      return NextResponse.json({ error: 'Alarm ID required' }, { status: 400 });
    }

    const db = await getDb();
    const { ObjectId } = await import('mongodb');

    const result = await db.collection('alarms').deleteOne({
      _id: new ObjectId(alarmId),
      userId: session.user.id, // Ensure user can only delete their own alarms
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Alarm not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Alarm delete error:', error);
    return NextResponse.json({ error: 'Failed to delete alarm' }, { status: 500 });
  }
}
