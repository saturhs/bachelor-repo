"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Save } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface DefaultSettingsValues {
  pregnancyLengthDays: number;
  dryOffDaysBeforeCalving: number;
  inseminationToPregnancyCheckDays: number;
  healthCheckIntervalDays: number;
}

export function DefaultSettingsForm() {
  const [settings, setSettings] = useState<DefaultSettingsValues>({
    pregnancyLengthDays: 280,
    dryOffDaysBeforeCalving: 60,
    inseminationToPregnancyCheckDays: 30,
    healthCheckIntervalDays: 14
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/settings');
        
        if (!response.ok) {
          throw new Error('Failed to fetch settings');
        }
        
        const data = await response.json();
        setSettings(data);
      } catch (err) {
        console.error('Error loading settings:', err);
        setError('Could not load settings. Using default values.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSettings();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: parseInt(value, 10)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccess(null);
    
    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update settings');
      }
      
      setSuccess('Settings updated successfully');
    } catch (err) {
      console.error('Error saving settings:', err);
      setError(err instanceof Error ? err.message : 'Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setSettings({
      pregnancyLengthDays: 280,
      dryOffDaysBeforeCalving: 60,
      inseminationToPregnancyCheckDays: 30,
      healthCheckIntervalDays: 14
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Breeding & Health Parameters</CardTitle>
        <CardDescription>
          Configure default timings for breeding cycles and health checks
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="pregnancyLengthDays">Pregnancy Length (days)</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Input
                    id="pregnancyLengthDays"
                    name="pregnancyLengthDays"
                    type="number"
                    min={200}
                    max={400}
                    value={settings.pregnancyLengthDays}
                    onChange={handleInputChange}
                    required
                  />
                  <span className="text-sm text-gray-500">days</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Holstein: 279 days, Jersey: 279 days, Brown Swiss: 290 days
                </p>
              </div>

              <div>
                <Label htmlFor="dryOffDaysBeforeCalving">Dry-Off Before Calving</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Input
                    id="dryOffDaysBeforeCalving"
                    name="dryOffDaysBeforeCalving"
                    type="number"
                    min={30}
                    max={120}
                    value={settings.dryOffDaysBeforeCalving}
                    onChange={handleInputChange}
                    required
                  />
                  <span className="text-sm text-gray-500">days before calving</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Recommended: 45-60 days before expected calving
                </p>
              </div>

              <div>
                <Label htmlFor="inseminationToPregnancyCheckDays">Pregnancy Check After Insemination</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Input
                    id="inseminationToPregnancyCheckDays"
                    name="inseminationToPregnancyCheckDays"
                    type="number"
                    min={14}
                    max={60}
                    value={settings.inseminationToPregnancyCheckDays}
                    onChange={handleInputChange}
                    required
                  />
                  <span className="text-sm text-gray-500">days after insemination</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Early check: 28-35 days, Late check: 45-60 days
                </p>
              </div>

              <div>
                <Label htmlFor="healthCheckIntervalDays">Health Check Interval</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Input
                    id="healthCheckIntervalDays"
                    name="healthCheckIntervalDays"
                    type="number"
                    min={7}
                    max={90}
                    value={settings.healthCheckIntervalDays}
                    onChange={handleInputChange}
                    required
                  />
                  <span className="text-sm text-gray-500">days</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Recommended: 14 days for regular checks
                </p>
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="bg-green-50 text-green-800 border-green-200">
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}
          </form>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handleReset} disabled={isLoading || isSaving}>
          Reset to Defaults
        </Button>
        <Button 
          onClick={handleSubmit} 
          disabled={isLoading || isSaving}
          className="flex items-center gap-2"
        >
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save Settings
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
