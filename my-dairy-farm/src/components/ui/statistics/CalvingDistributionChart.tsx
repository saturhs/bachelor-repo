"use client";

import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface MonthlyDistribution {
  month: number;
  name: string;
  count: number;
}

interface HeatmapItem {
  date: string;
  year: number;
  month: number;
  count: number;
}

interface CalvingDistributionData {
  totalCalvings: number;
  distributionByMonth: MonthlyDistribution[];
  heatmapData: HeatmapItem[];
}

export function CalvingDistributionChart() {
  const [data, setData] = useState<CalvingDistributionData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/statistics/calving-distribution');
        
        if (!response.ok) {
          throw new Error('Failed to fetch calving distribution data');
        }
        
        const result = await response.json();
        setData(result);
      } catch (err) {
        console.error('Error fetching calving distribution data:', err);
        setError('Could not load calving distribution data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length > 0) {
      return (
        <div className="bg-white p-4 border rounded-md shadow-sm">
          <p className="font-semibold">{label}</p>
          <p className="text-sm text-gray-600">
            Calvings: <span className="font-medium">{payload[0].value}</span>
          </p>
        </div>
      );
    }
    return null;
  };
  
  // Simple calendar heatmap implementation
  const renderCalendarHeatmap = () => {
    if (!data?.heatmapData || data.heatmapData.length === 0) return null;
    
    // Get unique years from the data
    const years = [...new Set(data.heatmapData.map(item => item.year))];
    
    // Find maximum count for color scaling
    const maxCount = Math.max(...data.heatmapData.map(item => item.count));
    
    return (
      <div className="mt-8">
        <h3 className="text-lg font-medium mb-3">Historical Calving Pattern</h3>
        <div className="space-y-4">
          {years.map(year => (
            <div key={year}>
              <h4 className="text-sm font-medium mb-2">{year}</h4>
              <div className="flex flex-wrap">
                {Array.from({ length: 12 }).map((_, monthIndex) => {
                  const monthData = data.heatmapData.find(
                    item => item.year === year && item.month === monthIndex
                  );
                  const count = monthData?.count || 0;
                  const intensity = count > 0 ? Math.max(0.2, Math.min(1, count / maxCount)) : 0;
                  
                  return (
                    <div 
                      key={monthIndex} 
                      className="w-14 h-14 m-1 flex items-center justify-center rounded-md text-xs"
                      style={{ 
                        backgroundColor: count > 0 
                          ? `rgba(79, 70, 229, ${intensity})` 
                          : '#f3f4f6',
                        color: intensity > 0.5 ? 'white' : 'black'
                      }}
                      title={`${['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][monthIndex]} ${year}: ${count} calvings`}
                    >
                      <div className="text-center">
                        <div>{['J','F','M','A','M','J','J','A','S','O','N','D'][monthIndex]}</div>
                        <div className="font-bold">{count}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Calving Distribution</CardTitle>
        <CardDescription>
          Monthly distribution of calving events throughout the year
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
        ) : !data || data.totalCalvings === 0 ? (
          <div className="h-[300px] flex items-center justify-center text-gray-500">
            No calving data available to analyze.
          </div>
        ) : (
          <>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={data.distributionByMonth}
                margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis 
                  allowDecimals={false}
                  label={{ value: 'Number of Calvings', angle: -90, position: 'insideLeft', offset: 10 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" fill="#4F46E5" />
              </BarChart>
            </ResponsiveContainer>
            
            {/* Calendar Heatmap View */}
            {renderCalendarHeatmap()}
            
            <div className="mt-4 pt-4 border-t text-sm text-gray-500">
              <p>This chart shows the distribution of calvings by month of the year.</p>
              <p className="mt-1">Total recorded calvings: {data.totalCalvings}</p>
              <p className="mt-1">
                Peak calving month: {
                  data.distributionByMonth.reduce((max, month) => 
                    month.count > max.count ? month : max, 
                    { name: 'None', count: 0 }
                  ).name
                }
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
