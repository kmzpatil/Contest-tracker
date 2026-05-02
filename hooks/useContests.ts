'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import type { Contest } from '@/lib/contestApi';

export function useContests(initialPlatform = 'all') {
  const [contests, setContests] = useState<Contest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [platform, setPlatform] = useState(initialPlatform);
  const abortRef = useRef<AbortController | null>(null);
  const CACHE_KEY = 'voidtrack-contests-cache';

  const readLocalCache = useCallback((): Contest[] => {
    if (typeof window === 'undefined') return [];
    try {
      const raw = window.localStorage.getItem(CACHE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw) as { contests?: Contest[] };
      return parsed.contests || [];
    } catch {
      return [];
    }
  }, []);

  const writeLocalCache = useCallback((nextContests: Contest[]) => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({ contests: nextContests, updatedAt: new Date().toISOString() }),
      );
    } catch {
      // Ignore quota errors
    }
  }, []);

  const loadContests = useCallback(async () => {
    // Cancel any in-flight request to prevent race conditions
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const cached = readLocalCache();
    if (cached.length > 0) {
      setContests(cached);
      setLoading(false);
    } else {
      setLoading(true);
    }

    setError('');
    try {
      const url = platform === 'all'
        ? '/api/contests'
        : `/api/contests?platform=${platform}`;

      const res = await fetch(url, { signal: controller.signal });
      if (!res.ok) throw new Error('Failed to fetch contests');

      const data = (await res.json()) as Contest[] | { contests?: Contest[] };
      const nextContests = Array.isArray(data) ? data : data.contests || [];
      setContests(nextContests);
      writeLocalCache(nextContests);
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') return;
      setError(err instanceof Error ? err.message : 'Failed to load contests');
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  }, [platform, readLocalCache, writeLocalCache]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadContests();
    return () => abortRef.current?.abort();
  }, [loadContests]);

  return { contests, loading, error, platform, setPlatform, refresh: loadContests };
}
