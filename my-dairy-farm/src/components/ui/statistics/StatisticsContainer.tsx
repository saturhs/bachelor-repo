"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ConceptionRateChart } from "./ConceptionRateChart";
import { PregnancyDistributionChart } from "./PregnancyDistributionChart";
import { CalvingDistributionChart } from "./CalvingDistributionChart";

export function StatisticsContainer() {
  const [activeTab, setActiveTab] = useState("conception-rate");

  return (
    <Tabs
      defaultValue="conception-rate"
      value={activeTab}
      onValueChange={setActiveTab}
      className="w-full"
    >
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="conception-rate">Conception Rate</TabsTrigger>
        <TabsTrigger value="pregnancy-distribution">Pregnancy Distribution</TabsTrigger>
        <TabsTrigger value="calving-distribution">Calving Distribution</TabsTrigger>
      </TabsList>

      <TabsContent value="conception-rate" className="space-y-6 py-4">
        <ConceptionRateChart />
      </TabsContent>

      <TabsContent value="pregnancy-distribution" className="space-y-6 py-4">
        <PregnancyDistributionChart />
      </TabsContent>

      <TabsContent value="calving-distribution" className="space-y-6 py-4">
        <CalvingDistributionChart />
      </TabsContent>
    </Tabs>
  );
}
