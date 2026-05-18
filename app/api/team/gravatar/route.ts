import { getTeamGravatarProfiles } from '@/lib/team-gravatar';
import type { TeamGravatarApiResponse } from '@/lib/team-gravatar-types';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const noStoreHeaders = {
  'Cache-Control': 'no-store',
};

const profileCacheHeaders = {
  'Cache-Control': 'public, s-maxage=21600, stale-while-revalidate=86400',
};

export async function GET() {
  const apiKey = process.env.GRAVATAR_API_KEY;

  if (!apiKey) {
    return Response.json(
      {
        profiles: {},
        errors: [{ id: 'anna', message: 'GRAVATAR_API_KEY is not configured' }],
      } satisfies TeamGravatarApiResponse,
      { status: 503, headers: noStoreHeaders }
    );
  }

  const payload = await getTeamGravatarProfiles(apiKey);

  return Response.json(payload, {
    headers: Object.keys(payload.profiles).length > 0 ? profileCacheHeaders : noStoreHeaders,
  });
}
