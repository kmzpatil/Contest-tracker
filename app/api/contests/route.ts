import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { fetchAllContestsFromAPIs, type Contest } from '@/lib/contestApi';

const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

function recalculateStatus(contests: Contest[]): Contest[] {
  const now = Date.now();
  return contests.map((contest) => {
    const start = new Date(contest.startTime).getTime();
    const end = new Date(contest.endTime).getTime();
    const status = start <= now && end >= now
      ? 'live'
      : start > now
      ? 'upcoming'
      : 'ended';

    return {
      ...contest,
      status,
      in24Hours: start - now <= 24 * 60 * 60 * 1000 && start >= now,
    };
  });
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const platformFilter = searchParams.get('platform');
    const forceRefresh = searchParams.get('force') === '1';

    const db = await getDb();
    const cacheCollection = db.collection('cache');
    const cacheKey = 'contests';

    // Find the cached contests
    const cachedRecord = await cacheCollection.findOne({ _id: cacheKey as any });
    
    const now = Date.now();
    let isStale = true;
    let dataToReturn: Contest[] = [];

    if (cachedRecord) {
      dataToReturn = recalculateStatus((cachedRecord.data || []) as Contest[]);
      if (now - (cachedRecord.lastUpdated as number) < CACHE_TTL_MS) {
        isStale = false;
      }
    }

    if (forceRefresh) {
      isStale = true;
    }

    // If no cache or cache is stale, trigger a background refresh
    if (isStale) {
      // We don't await this so it happens in the background (stale-while-revalidate)
      // Note: In serverless (Vercel), background promises might be killed when the response is sent.
      // Next.js usually waits for promises in waitUntil or we can just await it if we don't have data.
      
      if (dataToReturn.length === 0) {
        // If we have nothing to show, we MUST wait for the fetch
        const freshData = recalculateStatus(await fetchAllContestsFromAPIs());
        await cacheCollection.updateOne(
          { _id: cacheKey as any },
          { $set: { data: freshData, lastUpdated: now } },
          { upsert: true }
        );
        dataToReturn = freshData;
      } else {
        // Background refresh pattern
        fetchAllContestsFromAPIs().then(async (freshData) => {
          const normalized = recalculateStatus(freshData);
          if (normalized.length > 0) {
            await cacheCollection.updateOne(
              { _id: cacheKey as any },
              { $set: { data: normalized, lastUpdated: Date.now() } },
              { upsert: true }
            );
          }
        }).catch(err => console.error("Background refresh failed", err));
      }
    }

    const filtered = platformFilter && platformFilter !== 'all'
      ? dataToReturn.filter((contest) => contest.platform === platformFilter)
      : dataToReturn;

    return NextResponse.json({
      contests: filtered,
      total: filtered.length,
      source: isStale ? 'cache-revalidate' : 'cache',
      lastUpdated: cachedRecord?.lastUpdated ? new Date(cachedRecord.lastUpdated).toISOString() : null,
    });
  } catch (error: unknown) {
    console.error('Error in GET /api/contests:', error);
    return NextResponse.json({ error: 'Failed to fetch contests' }, { status: 500 });
  }
}
