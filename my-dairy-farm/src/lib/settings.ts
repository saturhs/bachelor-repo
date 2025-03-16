import { DefaultSettings } from "@/lib/db/models/DefaultSettings";
import { connectToDatabase } from "@/lib/db/mongodb";

// In-memory cache object
let settingsCache: any = null;
let cacheTimestamp: number = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds

// Default values if no settings are found
const defaultValues = {
  pregnancyLengthDays: 280,
  dryOffDaysBeforeCalving: 60,
  inseminationToPregnancyCheckDays: 30,
  healthCheckIntervalDays: 14
};

export async function getSettings() {
  // Check if cache is valid
  if (settingsCache && (Date.now() - cacheTimestamp < CACHE_TTL)) {
    return settingsCache;
  }

  // Cache is expired or doesn't exist, fetch from database
  try {
    await connectToDatabase();
    
    // Standard mongoose operations to find or create settings
    let settings = await DefaultSettings.findOne({});
    
    // If no settings exist yet, create with defaults
    if (!settings) {
      settings = await DefaultSettings.create(defaultValues);
    }
    
    // Update cache
    settingsCache = {
      pregnancyLengthDays: settings.pregnancyLengthDays,
      dryOffDaysBeforeCalving: settings.dryOffDaysBeforeCalving,
      inseminationToPregnancyCheckDays: settings.inseminationToPregnancyCheckDays,
      healthCheckIntervalDays: settings.healthCheckIntervalDays
    };
    cacheTimestamp = Date.now();
    
    // Log to console whenever cache is updated
    console.log("Default settings has been cached:", settingsCache);
    
    return settingsCache;
  } catch (error) {
    console.error("Error fetching settings:", error);
    // If database lookup fails, return default values
    return { ...defaultValues };
  }
}

export async function updateSettings(newSettings: any) {
  try {
    await connectToDatabase();
    
    // Find and update settings, create if doesn't exist
    const settings = await DefaultSettings.findOneAndUpdate(
      {}, // empty filter to match any document
      { $set: newSettings },
      { new: true, upsert: true } // return updated doc and create if not exists
    );
    
    // Update cache
    settingsCache = {
      pregnancyLengthDays: settings.pregnancyLengthDays,
      dryOffDaysBeforeCalving: settings.dryOffDaysBeforeCalving,
      inseminationToPregnancyCheckDays: settings.inseminationToPregnancyCheckDays,
      healthCheckIntervalDays: settings.healthCheckIntervalDays
    };
    cacheTimestamp = Date.now();
    
    // Log to console whenever cache is updated through settings update
    console.log("Default settings has been updated and cached:", settingsCache);
    
    return settingsCache;
  } catch (error) {
    console.error("Error updating settings:", error);
    throw error;
  }
}
