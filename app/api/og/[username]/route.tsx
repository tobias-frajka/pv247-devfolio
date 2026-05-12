import { ImageResponse } from 'next/og';

import { getPublicProfileHeader, getRealName } from '@/lib/queries/public-profile';

const HAPPY_CACHE = 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800';
const FALLBACK_CACHE = 'public, max-age=60, s-maxage=300';

function profileImage(displayName: string, headline: string, username: string) {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '80px',
        background: 'linear-gradient(135deg, #1a1410 0%, #2a1f18 100%)',
        color: '#f4ecd8',
        fontFamily: 'sans-serif'
      }}
    >
      <div
        style={{
          fontSize: 72,
          fontWeight: 600,
          letterSpacing: '-0.02em',
          lineHeight: 1.05
        }}
      >
        {displayName}
      </div>
      <div style={{ marginTop: 24, fontSize: 32, color: '#c0b59c' }}>{headline}</div>
      <div
        style={{
          marginTop: 'auto',
          fontSize: 24,
          color: '#8a7f6a',
          fontFamily: 'monospace'
        }}
      >
        {`devfolio.app/${username}`}
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
      headers: { 'Cache-Control': HAPPY_CACHE }
    }
  );
}

function notFoundImage(username: string) {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '80px',
        background: 'linear-gradient(135deg, #1a1410 0%, #2a1f18 100%)',
        color: '#f4ecd8',
        fontFamily: 'sans-serif'
      }}
    >
      <div
        style={{
          fontSize: 72,
          fontWeight: 600,
          letterSpacing: '-0.02em',
          lineHeight: 1.05
        }}
      >
        Portfolio not found
      </div>
      <div style={{ marginTop: 24, fontSize: 32, color: '#c0b59c' }}>
        This page does not exist on DevFolio.
      </div>
      <div
        style={{
          marginTop: 'auto',
          fontSize: 24,
          color: '#8a7f6a',
          fontFamily: 'monospace'
        }}
      >
        {`devfolio.app/${username}`}
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
      headers: { 'Cache-Control': FALLBACK_CACHE }
    }
  );
}

export async function GET(_req: Request, ctx: RouteContext<'/api/og/[username]'>) {
  const { username } = await ctx.params;
  try {
    const userData = await getPublicProfileHeader(username);
    if (!userData) return notFoundImage(username);

    const displayName = getRealName(userData) ?? `@${username}`;
    const headline = userData.profile?.headline || 'Developer portfolio';
    return profileImage(displayName, headline, username);
  } catch (err) {
    console.error('[og] failed to render OG image', { username, err });
    return notFoundImage(username);
  }
}
