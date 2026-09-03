import { randomUUID } from 'crypto';
import { cookies } from 'next/headers';

const PROVIDERS = {
  google: {
    clientId: 'GOOGLE_CLIENT_ID',
    clientSecret: 'GOOGLE_CLIENT_SECRET',
    authorize: 'https://accounts.google.com/o/oauth2/v2/auth',
    scope: 'openid email profile',
  },
  github: {
    clientId: 'GITHUB_CLIENT_ID',
    clientSecret: 'GITHUB_CLIENT_SECRET',
    authorize: 'https://github.com/login/oauth/authorize',
    scope: 'read:user user:email',
  },
} as const;

export async function GET(request: Request, { params }: { params: Promise<{ provider: string }> }) {
  const { provider } = await params;
  const config = PROVIDERS[provider as keyof typeof PROVIDERS];
  if (!config) return Response.json({ error: 'Unsupported OAuth provider.' }, { status: 400 });

  const clientId = process.env[config.clientId];
  const clientSecret = process.env[config.clientSecret];
  if (!clientId || !clientSecret) {
    const missing = !clientId ? config.clientId : config.clientSecret;
    return Response.json({ error: `${provider} OAuth is not configured. Add ${missing} to .env.local.` }, { status: 503 });
  }

  const origin = new URL(request.url).origin;
  const state = randomUUID();
  const callback = `${origin}/api/auth/${provider}/callback`;
  const url = new URL(config.authorize);
  url.searchParams.set('client_id', clientId);
  url.searchParams.set('redirect_uri', callback);
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('scope', config.scope);
  url.searchParams.set('state', state);

  const cookieStore = await cookies();
  cookieStore.set('sad-oauth-state', state, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', maxAge: 600, path: '/' });
  return Response.redirect(url);
}
