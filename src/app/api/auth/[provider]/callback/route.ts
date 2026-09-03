import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function GET(request: Request, { params }: { params: Promise<{ provider: string }> }) {
  const { provider } = await params;
  if (provider !== 'google' && provider !== 'github') redirect('/login?error=Unsupported%20OAuth%20provider');
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const cookieStore = await cookies();
  const savedState = cookieStore.get('sad-oauth-state')?.value;
  if (!code || !state || state !== savedState) redirect('/login?error=OAuth%20state%20validation%20failed');

  const origin = url.origin;
  const redirectUri = `${origin}/api/auth/${provider}/callback`;
  let profile: { name: string; email: string } | null = null;

  if (provider === 'google') {
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code, client_id: process.env.GOOGLE_CLIENT_ID, client_secret: process.env.GOOGLE_CLIENT_SECRET, redirect_uri: redirectUri, grant_type: 'authorization_code' }) });
    const tokens = await tokenResponse.json() as { access_token?: string };
    if (tokens.access_token) {
      const userResponse = await fetch('https://openidconnect.googleapis.com/v1/userinfo', { headers: { Authorization: `Bearer ${tokens.access_token}` } });
      const user = await userResponse.json() as { name?: string; email?: string };
      if (user.email) profile = { name: user.name ?? user.email.split('@')[0], email: user.email };
    }
  } else if (provider === 'github') {
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', { method: 'POST', headers: { Accept: 'application/json', 'Content-Type': 'application/json' }, body: JSON.stringify({ code, client_id: process.env.GITHUB_CLIENT_ID, client_secret: process.env.GITHUB_CLIENT_SECRET, redirect_uri: redirectUri }) });
    const tokens = await tokenResponse.json() as { access_token?: string };
    if (tokens.access_token) {
      const headers = { Authorization: `Bearer ${tokens.access_token}`, Accept: 'application/vnd.github+json' };
      const [userResponse, emailResponse] = await Promise.all([fetch('https://api.github.com/user', { headers }), fetch('https://api.github.com/user/emails', { headers })]);
      const user = await userResponse.json() as { name?: string; login?: string };
      const emails = await emailResponse.json() as Array<{ email: string; primary?: boolean; verified?: boolean }>;
      const email = emails.find((item) => item.primary && item.verified)?.email ?? emails.find((item) => item.verified)?.email;
      if (email) profile = { name: user.name ?? user.login ?? email.split('@')[0], email };
    }
  }

  if (!profile) redirect('/login?error=Could%20not%20complete%20OAuth%20sign-in');
  const encoded = Buffer.from(JSON.stringify({ ...profile, provider }), 'utf8').toString('base64url');
  redirect(`/auth/callback?user=${encoded}`);
}
