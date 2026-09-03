'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { NexaLogo } from '@/components/shared/nexa-logo';
import { useAppStore } from '@/stores/app-store';
import { signInWithOAuthProfile } from '@/lib/auth';

export default function AuthCallbackPage() {
  const router = useRouter();
  const setUser = useAppStore((state) => state.setUser);
  const [error, setError] = useState('');

  useEffect(() => {
    try {
      const encoded = new URLSearchParams(window.location.search).get('user');
      if (!encoded) throw new Error('No account information was returned.');
      const normalized = encoded.replace(/-/g, '+').replace(/_/g, '/');
      const profile = JSON.parse(atob(normalized)) as { name?: string; email?: string; provider?: 'google' | 'github' };
      if (!profile.email) throw new Error('The provider did not return an email address.');
      if (!profile.provider) throw new Error('The provider did not return an account type.');
      const user = signInWithOAuthProfile(profile.name ?? '', profile.email, profile.provider);
      setUser(user);
      router.replace('/app');
    } catch (callbackError) {
      queueMicrotask(() => setError(callbackError instanceof Error ? callbackError.message : 'Could not complete sign-in.'));
    }
  }, [router, setUser]);

  return <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background text-foreground"><NexaLogo size={36} showText /><p className="text-sm text-muted-foreground">{error || 'Completing sign-in...'}</p>{error && <button type="button" onClick={() => router.replace('/login')} className="text-sm underline">Return to login</button>}</div>;
}