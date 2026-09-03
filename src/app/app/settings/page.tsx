'use client';

import { useEffect, useState } from 'react';
import { Shield, Trash2, KeyRound, Save } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { getInitials } from '@/lib/utils';
import { updateCurrentUser } from '@/lib/auth';
import { useAppStore } from '@/stores/app-store';
import Link from 'next/link';

const PLAN_BADGE_CLASSES: Record<string, string> = {
  free: 'border-border text-muted-foreground',
  plus: 'border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400',
  pro: 'border-nexa-violet/30 bg-nexa-violet/10 text-nexa-violet',
  enterprise: 'border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400',
};

export default function SettingsPage() {
  const user = useAppStore((state) => state.user);
  const setUser = useAppStore((state) => state.setUser);

  // Profile form state
  const [name, setName] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [profileSaved, setProfileSaved] = useState(false);

  useEffect(() => {
    if (!user) return;
    queueMicrotask(() => {
      setName(user.name);
      setEmail(user.email);
    });
  }, [user]);

  // Password form state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSaved, setPasswordSaved] = useState(false);

  // Delete dialog state
  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [deleteOpen, setDeleteOpen] = useState(false);

  function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !name.trim() || !email.trim()) return;
    const updatedUser = { ...user, name: name.trim(), email: email.trim().toLowerCase() };
    updateCurrentUser(updatedUser);
    setUser(updatedUser);
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2500);
  }

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">No account signed in</CardTitle>
          <CardDescription>Sign in to manage your profile, or create your own Sad account.</CardDescription>
        </CardHeader>
        <CardContent className="flex gap-3">
          <Button asChild variant="nexa" size="sm"><Link href="/login">Sign in</Link></Button>
          <Button asChild variant="outline" size="sm"><Link href="/signup">Create account</Link></Button>
        </CardContent>
      </Card>
    );
  }

  function handleSavePassword(e: React.FormEvent) {
    e.preventDefault();
    setPasswordError('');
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters.');
      return;
    }
    setPasswordSaved(true);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setPasswordSaved(false), 2500);
  }

  const planLabel = user.plan.charAt(0).toUpperCase() + user.plan.slice(1);

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Account</h2>
        <p className="text-sm text-muted-foreground mt-1">Manage your profile, password, and account settings.</p>
      </div>

      {/* Profile card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Profile</CardTitle>
          <CardDescription>Your public identity on Sad.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar row */}
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="text-lg font-semibold bg-nexa-violet/10 text-nexa-violet">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-foreground">{user.name}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <Badge
                variant="outline"
                className={`mt-1.5 text-xs ${PLAN_BADGE_CLASSES[user.plan]}`}
              >
                {planLabel} Plan
              </Badge>
            </div>
          </div>

          <Separator />

          {/* Edit form */}
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Full name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>
            <div className="flex items-center gap-3">
              <Button type="submit" variant="nexa" size="sm" className="gap-2">
                <Save className="h-3.5 w-3.5" />
                {profileSaved ? 'Saved!' : 'Save changes'}
              </Button>
              {profileSaved && (
                <span className="text-sm text-emerald-500">Profile updated successfully.</span>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Password card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <KeyRound className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-base">Password</CardTitle>
          </div>
          <CardDescription>Change your account password. Use a strong, unique password.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSavePassword} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="current-password">Current password</Label>
              <Input
                id="current-password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="new-password">New password</Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="new-password"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="confirm-password">Confirm new password</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="new-password"
              />
            </div>

            {passwordError && (
              <p className="text-sm text-destructive">{passwordError}</p>
            )}

            <div className="flex items-center gap-3">
              <Button type="submit" size="sm" className="gap-2">
                <Shield className="h-3.5 w-3.5" />
                Update password
              </Button>
              {passwordSaved && (
                <span className="text-sm text-emerald-500">Password changed successfully.</span>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Danger zone */}
      <Card className="border-destructive/40">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Trash2 className="h-4 w-4 text-destructive" />
            <CardTitle className="text-base text-destructive">Danger Zone</CardTitle>
          </div>
          <CardDescription>
            Permanently delete your account and all associated data. This action cannot be undone.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive" size="sm">
                Delete account
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete your account?</DialogTitle>
                <DialogDescription>
                  This will permanently delete your Nexa account, all conversations, projects,
                  memories, and billing information. This action{' '}
                  <strong>cannot be undone</strong>.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-2">
                <Label htmlFor="delete-confirm">
                  Type <span className="font-mono font-semibold text-foreground">delete my account</span> to confirm
                </Label>
                <Input
                  id="delete-confirm"
                  value={deleteConfirm}
                  onChange={(e) => setDeleteConfirm(e.target.value)}
                  placeholder="delete my account"
                />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDeleteOpen(false)}>
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  disabled={deleteConfirm !== 'delete my account'}
                  onClick={() => setDeleteOpen(false)}
                >
                  Delete account
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
}
