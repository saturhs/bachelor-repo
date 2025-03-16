import mongoose from "mongoose";

const DefaultSettingsSchema = new mongoose.Schema({
  pregnancyLengthDays: { type: Number, default: 280, min: 200, max: 400 },
  dryOffDaysBeforeCalving: { type: Number, default: 60, min: 30, max: 120 },
  inseminationToPregnancyCheckDays: { type: Number, default: 30, min: 14, max: 60 },
  healthCheckIntervalDays: { type: Number, default: 14, min: 7, max: 90 }
}, { timestamps: true });

// Use findOne with no filter to always get the same settings document
DefaultSettingsSchema.statics.getSettings = async function() {
  let settings = await this.findOne({});
  
  // If no settings exist yet, create with defaults
  if (!settings) {
    settings = await this.create({});
  }
  
  return settings;
};

export const DefaultSettings = mongoose.models.DefaultSettings || 
  mongoose.model("DefaultSettings", DefaultSettingsSchema);
