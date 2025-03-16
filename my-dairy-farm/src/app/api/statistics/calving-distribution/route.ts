import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongodb";
import { Event } from "@/lib/db/models/Event";
import { format, getMonth, getYear } from "date-fns";

interface MonthlyDistribution {
  month: number;
  name: string;
  count: number;
}

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    console.log("Starting calving distribution calculation");
    
    // Get all completed calving events
    const calvingEvents = await Event.find({
      eventType: "Calving",
      status: "Completed"
    }).lean();
    
    console.log(`Found ${calvingEvents.length} calving events`);
    
    // Initialize data for all months
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const distributionByMonth: MonthlyDistribution[] = monthNames.map((name, index) => ({
      month: index,
      name,
      count: 0
    }));
    
    // Group calving events by month
    calvingEvents.forEach(event => {
      if (event.completedDate) {
        const month = getMonth(new Date(event.completedDate));
        distributionByMonth[month].count++;
      }
    });
    
    // Group calvings by year for historical view
    const yearlyData: Record<string, number> = {};
    
    calvingEvents.forEach(event => {
      if (event.completedDate) {
        const date = new Date(event.completedDate);
        const year = getYear(date);
        const month = getMonth(date);
        
        // Create a key in format "YYYY-MM"
        const yearMonthKey = `${year}-${String(month + 1).padStart(2, '0')}`;
        
        if (!yearlyData[yearMonthKey]) {
          yearlyData[yearMonthKey] = 0;
        }
        
        yearlyData[yearMonthKey]++;
      }
    });
    
    // Convert yearly data to array format for heatmap
    const heatmapData = Object.entries(yearlyData).map(([yearMonth, count]) => {
      const [year, month] = yearMonth.split('-').map(Number);
      return {
        date: yearMonth,
        year,
        month: month - 1, // Convert back to 0-indexed month
        count
      };
    });
    
    // Sort heatmap data by date
    heatmapData.sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year;
      return a.month - b.month;
    });
    
    return NextResponse.json({
      totalCalvings: calvingEvents.length,
      distributionByMonth,
      heatmapData
    });
  } catch (error) {
    console.error("Error calculating calving distribution:", error);
    return NextResponse.json(
      { error: "Failed to calculate calving distribution" },
      { status: 500 }
    );
  }
}
