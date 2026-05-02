export interface Contest {
  id: string;
  name: string;
  platform: 'codeforces' | 'leetcode' | 'codechef' | 'atcoder' | 'other';
  url: string;
  startTime: string; // ISO String
  endTime: string;   // ISO String
  duration: number; // in seconds
  status: 'upcoming' | 'live' | 'ended';
  in24Hours: boolean;
  platformColor: string;
  platformIcon: string;
}

export async function fetchCodeforcesContests(): Promise<Contest[]> {
  try {
    const res = await fetch('https://codeforces.com/api/contest.list');
    if (!res.ok) return [];
    const data = await res.json();
    
    if (data.status !== 'OK') return [];

    return data.result
      .filter((c: any) => c.phase === 'BEFORE' || c.phase === 'CODING')
      .map((c: any) => {
        const startTime = new Date(c.startTimeSeconds * 1000);
        const endTime = new Date((c.startTimeSeconds + c.durationSeconds) * 1000);
        const in24Hours = (startTime.getTime() - Date.now()) < 24 * 60 * 60 * 1000;

        return {
          id: `codeforces-${c.id}`,
          name: c.name,
          platform: 'codeforces',
          url: `https://codeforces.com/contests/${c.id}`,
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
          duration: c.durationSeconds,
          status: c.phase === 'CODING' ? 'live' : 'upcoming',
          in24Hours,
          platformColor: '#1a8cff',
          platformIcon: 'CF'
        };
      });
  } catch (err) {
    console.error('Failed to fetch CF contests', err);
    return [];
  }
}

export async function fetchLeetCodeContests(): Promise<Contest[]> {
  try {
    const query = `
      query { 
        upcomingContests { 
          title 
          startTime 
          duration 
        } 
      }
    `;
    const res = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    });
    
    if (!res.ok) return [];
    const data = await res.json();
    
    if (!data.data || !data.data.upcomingContests) return [];

    return data.data.upcomingContests.map((c: any) => {
      const startTime = new Date(c.startTime * 1000);
      const endTime = new Date((c.startTime + c.duration) * 1000);
      const in24Hours = (startTime.getTime() - Date.now()) < 24 * 60 * 60 * 1000;
      
      const slug = c.title.toLowerCase().replace(/ /g, '-');

      return {
        id: `leetcode-${slug}`,
        name: c.title,
        platform: 'leetcode',
        url: `https://leetcode.com/contest/${slug}`,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        duration: c.duration,
        status: (startTime.getTime() < Date.now() && endTime.getTime() > Date.now()) ? 'live' : 'upcoming',
        in24Hours,
        platformColor: '#ffa116',
        platformIcon: 'LC'
      };
    });
  } catch (err) {
    console.error('Failed to fetch LC contests', err);
    return [];
  }
}

export async function fetchAllContestsFromAPIs(): Promise<Contest[]> {
  const [cf, lc] = await Promise.all([
    fetchCodeforcesContests(),
    fetchLeetCodeContests()
  ]);

  const all = [...cf, ...lc];
  all.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  
  return all;
}
