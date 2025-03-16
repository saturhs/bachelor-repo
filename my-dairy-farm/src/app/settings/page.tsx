"use client";

import { useState } from "react";
import { Navbar } from "@/components/ui/Navbar";
import { GoBack } from "@/components/ui/Goback";
import { CustomEventForm } from "@/components/ui/CustomEventForm";
import { CustomEventsList } from "@/components/ui/CustomEventsList";
import { DataExport } from "@/components/ui/DataExport";
import { DefaultSettingsForm } from "@/components/ui/DefaultSettingsForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SettingsPage() {
  const [refreshCustomEventsList, setRefreshCustomEventsList] = useState(0);

  const handleEventAdded = () => {
    // Increment to trigger a re-fetch in the CustomEventsList
    setRefreshCustomEventsList(prev => prev + 1);
  };

  return (
    <main className="min-h-screen bg-[#faf9f6] relative">
      <Navbar />
      <GoBack />
      <div className="flex flex-col items-center justify-start pt-8">
        <h1 className="text-5xl font-bold mb-8">Settings</h1>
        <div className="w-[95%] md:w-[80%] lg:w-[60%] max-w-2xl mx-auto">
          <Tabs defaultValue="events" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="events">Custom Events</TabsTrigger>
              <TabsTrigger value="data">Data Management</TabsTrigger>
              <TabsTrigger value="defaults">Default Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="events" className="space-y-6 py-4">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Custom Event Types</h2>
                <CustomEventForm onEventAdded={handleEventAdded} />
              </div>
              <CustomEventsList refreshTrigger={refreshCustomEventsList} />
            </TabsContent>

            <TabsContent value="data" className="space-y-4 py-4">
              <h2 className="text-2xl font-bold">Data Management</h2>
              <DataExport />
            </TabsContent>

            <TabsContent value="defaults" className="space-y-4 py-4">
              <h2 className="text-2xl font-bold">Default Settings</h2>
              <DefaultSettingsForm />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </main>
  );
}