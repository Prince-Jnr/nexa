'use client';

import { useState } from 'react';
import { Bell, Save } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';

const DEFAULTS = { responses: true, product: true, email: false };

export default function NotificationsPage() {
  const [preferences, setPreferences] = useState(DEFAULTS);
  const [saved, setSaved] = useState(false);

  function update(key: keyof typeof DEFAULTS, value: boolean) {
    setPreferences((current) => ({ ...current, [key]: value }));
  }

  function savePreferences() {
    localStorage.setItem('nexa-notifications', JSON.stringify(preferences));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div><h2 className="text-xl font-semibold text-foreground">Notifications</h2><p className="mt-1 text-sm text-muted-foreground">Control when Nexa gets your attention.</p></div>
      <Card>
        <CardHeader><div className="flex items-center gap-2"><Bell className="h-4 w-4 text-nexa-violet" /><CardTitle className="text-base">Notification preferences</CardTitle></div><CardDescription>Preferences are saved on this device.</CardDescription></CardHeader>
        <CardContent className="space-y-5">
          <Preference label="Response ready" description="Notify me when a response finishes generating." checked={preferences.responses} onCheckedChange={(value) => update('responses', value)} />
          <Preference label="Product updates" description="Hear about new Nexa features and improvements." checked={preferences.product} onCheckedChange={(value) => update('product', value)} />
          <Preference label="Email notifications" description="Send important account updates to your email." checked={preferences.email} onCheckedChange={(value) => update('email', value)} />
          <div className="flex items-center gap-3 pt-2"><Button size="sm" variant="nexa" onClick={savePreferences} className="gap-2"><Save className="h-3.5 w-3.5" />Save preferences</Button>{saved && <span className="text-sm text-emerald-500">Saved.</span>}</div>
        </CardContent>
      </Card>
    </div>
  );
}

function Preference({ label, description, checked, onCheckedChange }: { label: string; description: string; checked: boolean; onCheckedChange: (value: boolean) => void }) {
  return <div className="flex items-center justify-between gap-4"><div><p className="text-sm font-medium text-foreground">{label}</p><p className="mt-0.5 text-xs text-muted-foreground">{description}</p></div><Switch checked={checked} onCheckedChange={onCheckedChange} /></div>;
}
