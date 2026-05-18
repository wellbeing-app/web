'use client';

import { useEffect, useState } from 'react';
import type {
  TeamGravatarApiResponse,
  TeamGravatarProfile,
} from '@/lib/team-gravatar-types';

export type TeamGravatarProfileMap = Record<string, TeamGravatarProfile>;

export function useTeamGravatarProfiles() {
  const [profiles, setProfiles] = useState<TeamGravatarProfileMap>({});

  useEffect(() => {
    const controller = new AbortController();

    async function loadProfiles() {
      try {
        const response = await fetch('/api/team/gravatar', {
          headers: { Accept: 'application/json' },
          signal: controller.signal,
        });

        if (!response.ok) return;

        const payload = (await response.json()) as TeamGravatarApiResponse;
        setProfiles(payload.profiles);
      } catch (error) {
        if (!(error instanceof DOMException && error.name === 'AbortError')) {
          setProfiles({});
        }
      }
    }

    void loadProfiles();

    return () => controller.abort();
  }, []);

  return profiles;
}
