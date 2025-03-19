"use client";

import { useState, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface DistributionItem {
  status: string;
  label: string;
  count: number;
  percentage: number;
  color: string;
}

interface PregnancyDistributionData {
  total: number;
  distribution: DistributionItem[];
}

export function PregnancyDistributionChart() {
  const [data, setData] = useState<PregnancyDistributionData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/statistics/pregnancy-distribution');
        
        if (!response.ok) {
          throw new Error('Failed to fetch pregnancy distribution data');
        }
        
        const result = await response.json();
        setData(result);
      } catch (err) {
        console.error('Error fetching pregnancy distribution data:', err);
        setError('Could not load pregnancy distribution data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length > 0) {
      const item = payload[0].payload;
      
      return (
        <div className="bg-white p-4 border rounded-md shadow-sm">
          <p className="font-semibold">{item.label}</p>
          <p className="text-sm text-gray-600">
            Count: <span className="font-medium">{item.count} animals</span>
          </p>
          <p className="text-sm text-gray-600">
            Percentage: <span className="font-medium">{item.percentage}%</span>
          </p>
        </div>
      );
    }
    return null;
  };
  
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, payload }: any) => {
    if (percent < 0.05) return null; 
    
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
  
    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Pregnancy Distribution</CardTitle>
        <CardDescription>
          Current distribution of female animals by reproductive status
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
        ) : !data || data.total === 0 ? (
          <div className="h-[300px] flex items-center justify-center text-gray-500">
            No female animals in the system to analyze.
          </div>
        ) : (
          <>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data.distribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="count"
                  nameKey="label"
                >
                  {data.distribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
            
            <div className="mt-4 pt-4 border-t text-sm text-gray-500">
              <p>This chart shows the current distribution of female animals across different reproductive stages.</p>
              <p className="mt-1">Total female animals: {data.total}</p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {data.distribution.map((item) => (
                  <div key={item.status} className="flex items-center">
                    <div className="w-3 h-3 mr-2" style={{ backgroundColor: item.color }}></div>
                    <span>
                      {item.label}: {item.count} ({item.percentage}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
