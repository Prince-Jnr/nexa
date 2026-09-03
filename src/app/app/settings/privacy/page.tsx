'use client';

import { useState } from 'react';
import { ShieldCheck, Save } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';

export default function PrivacyPage() {
  const [analytics, setAnalytics] = useState(false);
  const [training, setTraining] = useState(false);
  const [saved, setSaved] = useState(false);

  function savePreferences() {
    localStorage.setItem('nexa-privacy', JSON.stringify({ analytics, training }));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Privacy</h2>
        <p className="mt-1 text-sm text-muted-foreground">Choose how your workspace data is used.</p>
      </div>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-nexa-violet" /><CardTitle className="text-base">Data preferences</CardTitle></div>
          <CardDescription>These controls are saved on this device.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <Preference label="Product analytics" description="Share anonymous usage data to help improve Nexa." checked={analytics} onCheckedChange={setAnalytics} />
          <Preference label="Improve models with my chats" description="Allow conversations to be used for product improvement." checked={training} onCheckedChange={setTraining} />
          <div className="flex items-center gap-3 pt-2"><Button size="sm" variant="nexa" onClick={savePreferences} className="gap-2"><Save className="h-3.5 w-3.5" />Save preferences</Button>{saved && <span className="text-sm text-emerald-500">Saved.</span>}</div>
        </CardContent>
      </Card>
    </div>
  );
}

function Preference({ label, description, checked, onCheckedChange }: { label: string; description: string; checked: boolean; onCheckedChange: (value: boolean) => void }) {
  return <div className="flex items-center justify-between gap-4"><div><p className="text-sm font-medium text-foreground">{label}</p><p className="mt-0.5 text-xs text-muted-foreground">{description}</p></div><Switch checked={checked} onCheckedChange={onCheckedChange} /></div>;
}
