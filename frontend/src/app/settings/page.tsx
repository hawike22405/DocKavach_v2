"use client";

import { FormEvent, useEffect, useState } from "react";
import { Card, CardHeading } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { getSettings, hasToken, updateSettings, type Settings } from "@/lib/api";

const DEFAULT_SETTINGS: Settings = {
  stationName: "",
  checkpointId: "",
  autoFlagThreshold: 60,
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        if (!hasToken()) throw new Error("Please sign in before opening settings.");
        setSettings(await getSettings());
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not load settings");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const save = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setMessage(null);
    setError(null);
    try {
      await updateSettings(settings);
      setMessage("Settings saved.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="cyber-page-wrap cyber-settings-page">
      <div className="cyber-page-heading">
        <div><p className="gov-eyebrow">04 // CONTROL LAYER</p><h1 className="cyber-section-title">System settings<span>_</span></h1><p className="cyber-section-copy">Configure checkpoint identity and screening thresholds.</p></div>
      </div>

      {loading ? (
        <Card className="cyber-panel"><p className="text-sm text-slate-500">Loading settings…</p></Card>
      ) : (
        <Card>
          <CardHeading title="Checkpoint configuration" description="These values are stored per officer account." />
          <form onSubmit={save} className="space-y-4">
            <label className="block">
              <span className="text-sm text-slate-300">Station name</span>
              <input value={settings.stationName} onChange={(e) => setSettings({ ...settings, stationName: e.target.value })} className="cyber-input mt-1 w-full" />
            </label>
            <label className="block">
              <span className="text-sm text-slate-300">Checkpoint ID</span>
              <input value={settings.checkpointId} onChange={(e) => setSettings({ ...settings, checkpointId: e.target.value })} className="cyber-input mt-1 w-full" />
            </label>
            <label className="block">
              <span className="text-sm text-slate-300">Auto-flag threshold</span>
              <input type="number" min={0} max={100} value={settings.autoFlagThreshold} onChange={(e) => setSettings({ ...settings, autoFlagThreshold: Number(e.target.value) })} className="cyber-input mt-1 w-full" />
            </label>
            {error && <p role="alert" className="text-sm text-danger">{error}</p>}
            {message && <p className="text-sm text-success">{message}</p>}
            <div className="flex justify-end">
              <Button type="submit" variant="primary" disabled={saving}>{saving ? "Saving…" : "Save settings"}</Button>
            </div>
          </form>
        </Card>
      )}
    </div>
  );
}
