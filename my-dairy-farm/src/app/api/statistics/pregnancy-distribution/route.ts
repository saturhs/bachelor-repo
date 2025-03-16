import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongodb";
import { Animal } from "@/lib/db/models/Animal";

interface DistributionItem {
  status: string;
  label: string;
  count: number;
  percentage: number;
  color: string;
}

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    console.log("Starting pregnancy distribution calculation");
    
    // Define all the possible reproductive statuses
    const allStatuses = ["open", "bred", "confirmed pregnant", "dry", "not bred"];
    const statusLabels = {
      "open": "Ready for Breeding",
      "bred": "Inseminated",
      "confirmed pregnant": "Pregnant",
      "dry": "Dry (Late Pregnancy)",
      "not bred": "Not Bred"
    };
    
    // Initialize counts with proper typing to include percentage
    const distributionData: DistributionItem[] = allStatuses.map(status => ({
      status: status,
      label: statusLabels[status as keyof typeof statusLabels],
      count: 0,
      percentage: 0, // Initialize with 0
      color: getColorForStatus(status)
    }));
    
    // Get female animals only
    const animals = await Animal.find({ gender: "female" }).lean();
    
    console.log(`Found ${animals.length} female animals`);
    
    // Count animals by reproductive status
    animals.forEach(animal => {
      const status = animal.reproductiveStatus || "not bred"; // Default to "not bred" if no status
      
      // Find the corresponding status in our data array
      const statusEntry = distributionData.find(item => item.status === status);
      if (statusEntry) {
        statusEntry.count++;
      } else {
        console.log(`Found animal with unknown status: ${status}`);
      }
    });
    
    // Calculate percentages
    const totalAnimals = animals.length;
    distributionData.forEach(item => {
      item.percentage = totalAnimals > 0 ? Math.round((item.count / totalAnimals) * 100) : 0;
    });
    
    // Sort by count in descending order
    distributionData.sort((a, b) => b.count - a.count);
    
    // Log the results
    console.log("Pregnancy distribution data:", distributionData);
    
    return NextResponse.json({
      total: totalAnimals,
      distribution: distributionData
    });
  } catch (error) {
    console.error("Error calculating pregnancy distribution:", error);
    return NextResponse.json(
      { error: "Failed to calculate pregnancy distribution" },
      { status: 500 }
    );
  }
}

// Helper function to get a color for each status
function getColorForStatus(status: string): string {
  switch (status) {
    case "open":
      return "#8884d8"; // Purple
    case "bred":
      return "#82ca9d"; // Green
    case "confirmed pregnant":
      return "#ffc658"; // Yellow/Gold
    case "dry":
      return "#ff8042"; // Orange
    case "not bred":
      return "#0088fe"; // Blue
    default:
      return "#888888"; // Grey for unknown
  }
}
