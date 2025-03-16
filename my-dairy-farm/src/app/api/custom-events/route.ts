import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongodb";
import { Event } from "@/lib/db/models/Event";
import { CustomEventType } from "@/lib/db/models/CustomEventType";
import { Animal } from "@/lib/db/models/Animal";
import mongoose from "mongoose";
import { addHours, addDays, addWeeks, addMonths } from "date-fns";

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const { animalId, customEventTypeId, notes } = body;
    
    if (!animalId || !customEventTypeId) {
      return NextResponse.json(
        { error: "Animal ID and custom event type ID are required" },
        { status: 400 }
      );
    }
    
    // Get animal data
    const animal = await Animal.findById(animalId);
    if (!animal) {
      return NextResponse.json(
        { error: "Animal not found" },
        { status: 404 }
      );
    }
    
    // Get custom event type data
    const customEventType = await CustomEventType.findById(customEventTypeId);
    if (!customEventType) {
      return NextResponse.json(
        { error: "Custom event type not found" },
        { status: 404 }
      );
    }
    
    // Create the current event (happening now)
    const currentEvent = new Event({
      eventType: customEventType.name,
      animalId: new mongoose.Types.ObjectId(animalId),
      title: `${customEventType.name} for ${animal.tag}`,
      description: customEventType.description || `Custom event: ${customEventType.name}`,
      scheduledDate: new Date(), // Current event happening now
      status: "Completed", // Mark as completed
      completedDate: new Date(),
      priority: customEventType.defaultPriority,
      location: animal.location,
      notes: notes || ""
    });
    
    const savedCurrentEvent = await currentEvent.save();
    
    // Calculate next event date based on reminder time
    const now = new Date();
    let nextEventDate;
    
    switch(customEventType.reminderTime.unit) {
      case 'hour':
        nextEventDate = addHours(now, customEventType.reminderTime.value);
        break;
      case 'day':
        nextEventDate = addDays(now, customEventType.reminderTime.value);
        break;
      case 'week':
        nextEventDate = addWeeks(now, customEventType.reminderTime.value);
        break;
      case 'month':
        nextEventDate = addMonths(now, customEventType.reminderTime.value);
        break;
      default:
        nextEventDate = addDays(now, 7); // Default to 1 week if something goes wrong
    }
    
    // Schedule the next event
    const nextEvent = new Event({
      eventType: customEventType.name,
      animalId: new mongoose.Types.ObjectId(animalId),
      title: `${customEventType.name} for ${animal.tag}`,
      description: customEventType.description || `Custom event: ${customEventType.name}`,
      scheduledDate: nextEventDate,
      status: "Pending", // Next event is pending
      priority: customEventType.defaultPriority,
      location: animal.location,
      associatedEvents: [savedCurrentEvent._id]
    });
    
    const savedNextEvent = await nextEvent.save();
    
    return NextResponse.json({ 
      success: true,
      message: `${customEventType.name} recorded successfully. Next event scheduled for ${nextEventDate.toDateString()}`,
      currentEvent: {
        id: savedCurrentEvent._id.toString(),
        eventType: savedCurrentEvent.eventType,
        status: "Completed",
        scheduledDate: savedCurrentEvent.scheduledDate
      },
      nextEvent: {
        id: savedNextEvent._id.toString(),
        eventType: savedNextEvent.eventType,
        status: "Pending",
        scheduledDate: savedNextEvent.scheduledDate
      }
    }, { status: 201 });
    
  } catch (error) {
    console.error("Error recording custom event:", error);
    return NextResponse.json(
      { error: "Failed to record custom event" },
      { status: 500 }
    );
  }
}
