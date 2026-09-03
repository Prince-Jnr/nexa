import type { User } from '@/types';

const ACCOUNTS_KEY = 'nexa-accounts';
const CURRENT_USER_KEY = 'nexa-current-user';

interface StoredAccount {
  user: User;
  passwordHash?: string;
  provider: 'email' | 'google';
}

function readAccounts(): StoredAccount[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(ACCOUNTS_KEY) ?? '[]') as StoredAccount[];
  } catch {
    return [];
  }
}

function writeAccounts(accounts: StoredAccount[]) {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}

async function hashPassword(password: string): Promise<string> {
  const data = new TextEncoder().encode(password);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

function createUser(name: string, email: string): User {
  return {
    id: `user-${crypto.randomUUID()}`,
    name,
    email,
    avatar: '',
    plan: 'free',
    createdAt: new Date().toISOString(),
    preferences: {
      theme: 'system',
      defaultModel: 'nexa-pro',
      memoryEnabled: true,
      responseStyle: 'balanced',
      language: 'en',
    },
  };
}

function saveCurrentUser(user: User) {
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  return user;
}

export async function createAccount(name: string, email: string, password: string): Promise<User> {
  const normalizedEmail = email.trim().toLowerCase();
  const accounts = readAccounts();
  if (accounts.some((account) => account.user.email === normalizedEmail)) {
    throw new Error('An account with this email already exists.');
  }

  const user = createUser(name.trim(), normalizedEmail);
  accounts.push({ user, passwordHash: await hashPassword(password), provider: 'email' });
  writeAccounts(accounts);
  return saveCurrentUser(user);
}

export async function signIn(email: string, password: string): Promise<User> {
  const normalizedEmail = email.trim().toLowerCase();
  const account = readAccounts().find((item) => item.user.email === normalizedEmail);
  if (!account?.passwordHash || account.passwordHash !== await hashPassword(password)) {
    throw new Error('Email or password is incorrect.');
  }
  return saveCurrentUser(account.user);
}

export function signInWithGoogleEmail(email: string): User {
  const normalizedEmail = email.trim().toLowerCase();
  const accounts = readAccounts();
  const existing = accounts.find((account) => account.user.email === normalizedEmail);
  if (existing) return saveCurrentUser(existing.user);

  const user = createUser(normalizedEmail.split('@')[0] || 'Google user', normalizedEmail);
  accounts.push({ user, provider: 'google' });
  writeAccounts(accounts);
  return saveCurrentUser(user);
}

export function signInWithOAuthProfile(name: string, email: string): User {
  const normalizedEmail = email.trim().toLowerCase();
  const accounts = readAccounts();
  const existing = accounts.find((account) => account.user.email === normalizedEmail);
  if (existing) return saveCurrentUser(existing.user);

  const user = createUser(name.trim() || normalizedEmail.split('@')[0], normalizedEmail);
  accounts.push({ user, provider: 'google' });
  writeAccounts(accounts);
  return saveCurrentUser(user);
}

export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null;
  try {
    const value = localStorage.getItem(CURRENT_USER_KEY);
    return value ? (JSON.parse(value) as User) : null;
  } catch {
    return null;
  }
}

export function updateCurrentUser(user: User) {
  const accounts = readAccounts().map((account) =>
    account.user.id === user.id ? { ...account, user } : account,
  );
  writeAccounts(accounts);
  saveCurrentUser(user);
}

export function signOut() {
  localStorage.removeItem(CURRENT_USER_KEY);
}
