import { NextRequest, NextResponse } from "next/server";
import { getSettings, updateSettings } from "@/lib/settings";

export async function GET() {
  try {
    const settings = await getSettings();
    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (body.pregnancyLengthDays !== undefined && 
        (body.pregnancyLengthDays < 200 || body.pregnancyLengthDays > 400)) {
      return NextResponse.json(
        { error: "Pregnancy length must be between 200 and 400 days" },
        { status: 400 }
      );
    }
    
    if (body.dryOffDaysBeforeCalving !== undefined && 
        (body.dryOffDaysBeforeCalving < 30 || body.dryOffDaysBeforeCalving > 120)) {
      return NextResponse.json(
        { error: "Dry-off timing must be between 30 and 120 days before calving" },
        { status: 400 }
      );
    }
    
    if (body.inseminationToPregnancyCheckDays !== undefined && 
        (body.inseminationToPregnancyCheckDays < 14 || body.inseminationToPregnancyCheckDays > 60)) {
      return NextResponse.json(
        { error: "Pregnancy check timing must be between 14 and 60 days after insemination" },
        { status: 400 }
      );
    }
    
    if (body.healthCheckIntervalDays !== undefined && 
        (body.healthCheckIntervalDays < 7 || body.healthCheckIntervalDays > 90)) {
      return NextResponse.json(
        { error: "Health check interval must be between 7 and 90 days" },
        { status: 400 }
      );
    }
    
    const updated = await updateSettings(body);
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}
