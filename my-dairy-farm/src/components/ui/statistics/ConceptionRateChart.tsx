"use client";

import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ConceptionRateData {
  month: string;
  totalPregnancyChecks: number;
  successfulPregnancyChecks: number;
  conceptionRate: number;
}

export function ConceptionRateChart() {
  const [data, setData] = useState<ConceptionRateData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/statistics/conception-rate');
        
        if (!response.ok) {
          throw new Error('Failed to fetch conception rate data');
        }
        
        const result = await response.json();
        setData(result);
      } catch (err) {
        console.error('Error fetching conception rate data:', err);
        setError('Could not load conception rate data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length > 0) {
      const dataPoint = payload[0].payload;
      
      return (
        <div className="bg-white p-4 border rounded-md shadow-sm">
          <p className="font-semibold">{label}</p>
          <p className="text-sm text-gray-600">
            Conception Rate: <span className="font-medium">{dataPoint.conceptionRate}%</span>
          </p>
          <p className="text-sm text-gray-600">
            Successful: <span className="font-medium">{dataPoint.successfulPregnancyChecks}</span> / {dataPoint.totalPregnancyChecks}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Conception Rate</CardTitle>
        <CardDescription>
          Percentage of successful pregnancy confirmations by month, based on pregnancy check results
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="w-full">
            <Skeleton className="h-[300px] w-full" />
          </div>
        ) : error ? (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : data.length === 0 ? (
          <div className="h-[300px] flex items-center justify-center text-gray-500">
            No conception rate data available. Complete pregnancy checks to see statistics.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={data}
              margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="month"
                padding={{ left: 20, right: 20 }}
              />
              <YAxis 
                domain={[0, 100]} 
                tickFormatter={(tick) => `${tick}%`}
                label={{ value: 'Success Rate', angle: -90, position: 'insideLeft', offset: 10 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="conceptionRate" 
                name="Conception Rate" 
                stroke="#8884d8" 
                strokeWidth={2}
                dot={{ r: 5 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
        
        {data.length > 0 && (
          <div className="mt-4 pt-4 border-t text-sm text-gray-500">
            <p>This chart shows the percentage of pregnancy checks that resulted in confirmed pregnancies each month.</p>
            <p className="mt-1">Total pregnancy checks performed: {data.reduce((sum, month) => sum + month.totalPregnancyChecks, 0)}</p>
            <p className="mt-1">Total confirmed pregnancies count: {data.reduce((sum, month) => sum + month.successfulPregnancyChecks, 0)}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
