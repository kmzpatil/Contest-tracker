import type { WithId } from 'mongodb';

export interface TopicBucket {
  label: string;
  count: number;
  source: 'codeforces' | 'leetcode';
}

export interface SubmissionEntry {
  id: string;
  title: string;
  titleSlug?: string;
  timestamp: number;
  platform: 'codeforces' | 'leetcode';
}

export interface ContestHistoryEntry {
  contestId: string;
  contestName: string;
  rating: number;
  rank: number;
  timestamp: number;
}

export interface CodeforcesStats {
  handle: string;
  rating: number;
  maxRating: number;
  rank: string;
  maxRank: string;
  avatar: string;
  contribution: number;
  contests: number;
  solved: number;
  topicDistribution: TopicBucket[];
  contestHistory: ContestHistoryEntry[];
  recentSubmissions: SubmissionEntry[];
}

export interface LeetCodeStats {
  handle: string;
  rating: number;
  rank: number;
  avatar: string;
  solved: number;
  topicDistribution: TopicBucket[];
  contestHistory: ContestHistoryEntry[];
  recentSubmissions: SubmissionEntry[];
}

export interface SyncedProfile {
  handle: string;
  codeforces: CodeforcesStats | null;
  leetcode: LeetCodeStats | null;
  topicDistribution: TopicBucket[];
  solvedTotal: number;
  syncedAt: string;
}

export interface StoredProfile extends SyncedProfile {
  userId: string;
  email: string;
  name: string;
}

interface CodeforcesInfo {
  handle: string;
  rating?: number;
  maxRating?: number;
  rank?: string;
  maxRank?: string;
  titlePhoto?: string;
  avatar?: string;
  contribution?: number;
}

interface CodeforcesInfoResponse {
  status: string;
  result?: CodeforcesInfo[];
}

interface CodeforcesRatingResponse {
  status: string;
  result?: unknown[];
}

interface CodeforcesProblem {
  contestId?: number;
  index?: string;
  tags?: string[];
}

interface CodeforcesSubmission {
  verdict?: string;
  problem?: CodeforcesProblem;
}

interface CodeforcesStatusResponse {
  status: string;
  result?: CodeforcesSubmission[];
}

interface LeetCodeTagItem {
  tagName: string;
  problemsSolved: number;
}

interface LeetCodeSubmitItem {
  difficulty: string;
  count: number;
}

interface LeetCodeGraphQLResponse {
  data?: {
    matchedUser?: {
      username: string;
      profile: {
        userAvatar: string;
        ranking: number;
      };
      submitStats: {
        acSubmissionNum: LeetCodeSubmitItem[];
      };
      tagProblemCounts?: {
        advanced?: LeetCodeTagItem[];
        intermediate?: LeetCodeTagItem[];
        fundamental?: LeetCodeTagItem[];
      };
    };
    userContestRanking?: {
      rating: number;
      globalRanking: number;
    } | null;
    userContestRankingHistory?: Array<{
      attended: boolean;
      rating: number;
      ranking: number;
      contest: {
        title: string;
        startTime: number;
      };
    }>;
    recentAcSubmissionList?: Array<{
      id: string;
      title: string;
      titleSlug: string;
      timestamp: string;
    }>;
  };
}

function normalizeTags(
  source: 'codeforces' | 'leetcode',
  entries: Array<{ label: string; count: number }>,
  limit = 8,
): TopicBucket[] {
  return entries
    .filter((entry) => entry.count > 0 && entry.label.trim().length > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, limit)
    .map((entry) => ({
      label: entry.label,
      count: entry.count,
      source,
    }));
}

function mergeTopicDistribution(
  codeforcesTopics: TopicBucket[],
  leetCodeTopics: TopicBucket[],
  limit = 10,
): TopicBucket[] {
  const merged = [...codeforcesTopics, ...leetCodeTopics];
  merged.sort((a, b) => b.count - a.count);
  return merged.slice(0, limit);
}

async function fetchCodeforcesUser(handle: string): Promise<CodeforcesStats> {
  const [infoRes, ratingRes, statusRes] = await Promise.all([
    fetch(`https://codeforces.com/api/user.info?handles=${encodeURIComponent(handle)}`),
    fetch(`https://codeforces.com/api/user.rating?handle=${encodeURIComponent(handle)}`),
    fetch(`https://codeforces.com/api/user.status?handle=${encodeURIComponent(handle)}&from=1&count=400`),
  ]);

  if (!infoRes.ok || !ratingRes.ok || !statusRes.ok) {
    throw new Error('Codeforces API request failed');
  }

  const infoData = (await infoRes.json()) as CodeforcesInfoResponse;
  const ratingData = (await ratingRes.json()) as CodeforcesRatingResponse;
  const statusData = (await statusRes.json()) as CodeforcesStatusResponse;

  if (infoData.status !== 'OK' || !infoData.result || infoData.result.length === 0) {
    throw new Error('Codeforces user not found');
  }

  const user = infoData.result[0];
  const accepted = (statusData.result || []).filter((item) => item.verdict === 'OK');

  const solvedUnique = new Set<string>();
  const tagCounter = new Map<string, number>();

  for (const submission of accepted) {
    const contestId = submission.problem?.contestId;
    const index = submission.problem?.index;
    if (contestId && index) {
      solvedUnique.add(`${contestId}-${index}`);
    }

    for (const tag of submission.problem?.tags || []) {
      const current = tagCounter.get(tag) || 0;
      tagCounter.set(tag, current + 1);
    }
  }

  const topicDistribution = normalizeTags(
    'codeforces',
    Array.from(tagCounter.entries()).map(([label, count]) => ({ label, count })),
  );

  const contestHistory: ContestHistoryEntry[] = (ratingData.result || []).map((c: any) => ({
    contestId: c.contestId.toString(),
    contestName: c.contestName,
    rating: c.newRating,
    rank: c.rank,
    timestamp: c.ratingUpdateTimeSeconds,
  }));

  const recentSubmissions: SubmissionEntry[] = accepted.slice(0, 10).map((s: any) => ({
    id: `${s.contestId}-${s.problem.index}`,
    title: s.problem.name,
    timestamp: s.creationTimeSeconds,
    platform: 'codeforces',
  }));

  return {
    handle: user.handle,
    rating: user.rating || 0,
    maxRating: user.maxRating || 0,
    rank: user.rank || 'Unrated',
    maxRank: user.maxRank || 'Unrated',
    avatar: user.titlePhoto || user.avatar || '',
    contribution: user.contribution || 0,
    contests: (ratingData.result || []).length,
    solved: solvedUnique.size,
    topicDistribution,
    contestHistory,
    recentSubmissions,
  };
}

async function fetchLeetCodeUser(handle: string): Promise<LeetCodeStats> {
  const query = `
    query profile($username: String!) {
      matchedUser(username: $username) {
        username
        profile {
          userAvatar
          ranking
        }
        submitStats {
          acSubmissionNum {
            difficulty
            count
          }
        }
        tagProblemCounts {
          advanced {
            tagName
            problemsSolved
          }
          intermediate {
            tagName
            problemsSolved
          }
          fundamental {
            tagName
            problemsSolved
          }
        }
      }
      userContestRanking(username: $username) {
        rating
        globalRanking
      }
      userContestRankingHistory(username: $username) {
        attended
        rating
        ranking
        contest {
          title
          startTime
        }
      }
      recentAcSubmissionList(username: $username, limit: 10) {
        id
        title
        titleSlug
        timestamp
      }
    }
  `;

  const res = await fetch('https://leetcode.com/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables: { username: handle } }),
  });

  if (!res.ok) {
    throw new Error('LeetCode API request failed');
  }

  const data = (await res.json()) as LeetCodeGraphQLResponse;
  const matchedUser = data.data?.matchedUser;

  if (!matchedUser) {
    throw new Error('LeetCode user not found');
  }

  const solved = matchedUser.submitStats.acSubmissionNum.find(
    (item) => item.difficulty === 'All',
  )?.count || 0;

  const tags = [
    ...(matchedUser.tagProblemCounts?.fundamental || []),
    ...(matchedUser.tagProblemCounts?.intermediate || []),
    ...(matchedUser.tagProblemCounts?.advanced || []),
  ];

  const topicDistribution = normalizeTags(
    'leetcode',
    tags.map((item) => ({
      label: item.tagName,
      count: item.problemsSolved,
    })),
  );

  const contest = data.data?.userContestRanking;
  const history = data.data?.userContestRankingHistory || [];
  const recent = data.data?.recentAcSubmissionList || [];

  const contestHistory: ContestHistoryEntry[] = history
    .filter((h) => h.attended)
    .map((h) => ({
      contestId: h.contest.title,
      contestName: h.contest.title,
      rating: Math.round(h.rating),
      rank: h.ranking,
      timestamp: h.contest.startTime,
    }));

  const recentSubmissions: SubmissionEntry[] = recent.map((s) => ({
    id: s.id,
    title: s.title,
    titleSlug: s.titleSlug,
    timestamp: parseInt(s.timestamp),
    platform: 'leetcode',
  }));

  return {
    handle: matchedUser.username,
    rating: contest?.rating ? Math.round(contest.rating) : 0,
    rank: contest?.globalRanking || matchedUser.profile.ranking || 0,
    avatar: matchedUser.profile.userAvatar || '',
    solved,
    topicDistribution,
    contestHistory,
    recentSubmissions,
  };
}

export async function syncProfileForHandle(handle: string): Promise<SyncedProfile> {
  const normalizedHandle = handle.trim();

  const [cfRes, lcRes] = await Promise.allSettled([
    fetchCodeforcesUser(normalizedHandle),
    fetchLeetCodeUser(normalizedHandle),
  ]);

  const codeforces = cfRes.status === 'fulfilled' ? cfRes.value : null;
  const leetcode = lcRes.status === 'fulfilled' ? lcRes.value : null;

  if (!codeforces && !leetcode) {
    throw new Error('Unable to fetch profile from either platform for this handle');
  }

  const topicDistribution = mergeTopicDistribution(
    codeforces?.topicDistribution || [],
    leetcode?.topicDistribution || [],
  );

  return {
    handle: normalizedHandle,
    codeforces,
    leetcode,
    topicDistribution,
    solvedTotal: (codeforces?.solved || 0) + (leetcode?.solved || 0),
    syncedAt: new Date().toISOString(),
  };
}

export function sanitizeStoredProfile(doc: WithId<StoredProfile> | null): StoredProfile | null {
  if (!doc) return null;
  const { _id, ...rest } = doc;
  void _id;
  return rest;
}
