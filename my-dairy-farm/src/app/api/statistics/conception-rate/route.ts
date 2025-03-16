import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongodb";
import { Event } from "@/lib/db/models/Event";
import { startOfMonth, endOfMonth, format, subMonths } from "date-fns";

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    console.log("Starting conception rate calculation");
    
    // Get the last 12 months
    const months = 12;
    let currentDate = new Date();
    const monthlyData = [];
    
    for (let i = 0; i < months; i++) {
      // Calculate start and end of month
      const monthStart = startOfMonth(subMonths(currentDate, i));
      const monthEnd = endOfMonth(subMonths(currentDate, i));
      
      console.log(`Calculating for month: ${format(monthStart, 'MMM yyyy')}`);
      
      // Find all pregnancy check events that were completed in this month
      const pregnancyCheckEvents = await Event.find({
        eventType: "PregnancyCheck",
        status: "Completed",
        completedDate: { $gte: monthStart, $lte: monthEnd }
      }).lean();
      
      console.log(`Found ${pregnancyCheckEvents.length} pregnancy checks for ${format(monthStart, 'MMM yyyy')}`);
      
      // Count total pregnancy checks for the month
      const totalPregnancyChecks = pregnancyCheckEvents.length;
      
      // Count successful pregnancy checks using the result field
      const successfulPregnancyChecks = pregnancyCheckEvents.filter(check => {
        // First check the dedicated result field
        if (check.result === 'positive') {
          return true;
        }
        
        if (check.result === 'negative') {
          return false;
        }
        
        // For backward compatibility - if result field is not set,
        // check if notes contain "pregnancy confirmed" or similar positive indicators
        if (check.notes) {
          const notesLower = check.notes.toLowerCase();
          if (notesLower.includes('not pregnant') || notesLower.includes('negative')) {
            return false;
          }
          if (notesLower.includes('confirmed') || notesLower.includes('positive') || 
              notesLower.includes('pregnant')) {
            return true;
          }
        }
        
        // Default to false if we can't determine result
        return false;
      }).length;
      
      console.log(`Successful checks: ${successfulPregnancyChecks} of ${totalPregnancyChecks}`);
      
      // Calculate conception rate
      const conceptionRate = totalPregnancyChecks > 0
        ? (successfulPregnancyChecks / totalPregnancyChecks) * 100
        : 0;
      
      console.log(`Conception rate for ${format(monthStart, 'MMM yyyy')}: ${Math.round(conceptionRate)}%`);
      
      // Format the month for display
      const monthLabel = format(monthStart, 'MMM yyyy');
      
      monthlyData.push({
        month: monthLabel,
        totalPregnancyChecks,
        successfulPregnancyChecks,
        conceptionRate: Math.round(conceptionRate),
      });
    }
    
    // Reverse to have oldest month first
    monthlyData.reverse();
    
    return NextResponse.json(monthlyData);
  } catch (error) {
    console.error("Error calculating conception rate:", error);
    return NextResponse.json(
      { error: "Failed to calculate conception rate" },
      { status: 500 }
    );
  }
}
