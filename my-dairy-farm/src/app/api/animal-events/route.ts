import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongodb";
import { Event } from "@/lib/db/models/Event";
import { Animal } from "@/lib/db/models/Animal";
import { addDays, addHours } from "date-fns";
import mongoose from "mongoose";

// Helper function to create events
async function createEvent(data: any) {
  const event = new Event(data);
  return event.save();
}

// Helper to find pending events of a specific type for an animal
async function findPendingEvent(animalId: string, eventType: string) {
  return Event.findOne({
    animalId: new mongoose.Types.ObjectId(animalId),
    eventType,
    status: "Pending"
  });
}

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const animalId = searchParams.get("animalId");
    
    if (!animalId) {
      return NextResponse.json(
        { error: "Animal ID is required" },
        { status: 400 }
      );
    }
    
    const events = await Event.find({ animalId }).sort({ scheduledDate: 1 });
    
    // Transform MongoDB documents to match our Event interface
    const transformedEvents = events.map(event => ({
      id: event._id.toString(),
      eventType: event.eventType,
      animalId: event.animalId.toString(),
      title: event.title,
      description: event.description,
      scheduledDate: event.scheduledDate,
      status: event.status,
      priority: event.priority,
      repeatPattern: event.repeatPattern,
      repeatInterval: event.repeatInterval,
      reminderTime: event.reminderTime,
      notificationSent: event.notificationSent,
      createdBy: event.createdBy?.toString(),
      location: event.location,
      completedDate: event.completedDate,
      completedBy: event.completedBy?.toString(),
      notes: event.notes,
      associatedEvents: event.associatedEvents?.map(id => id.toString()),
      createdAt: event.createdAt,
      updatedAt: event.updatedAt
    }));

    return NextResponse.json(transformedEvents);
  } catch (error) {
    console.error("Error fetching animal events:", error);
    return NextResponse.json(
      { error: "Failed to fetch animal events" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const { animalId, action, notes } = body;
    
    if (!animalId) {
      return NextResponse.json(
        { error: "Animal ID is required" },
        { status: 400 }
      );
    }
    
    // Get the animal data
    const animal = await Animal.findById(animalId);
    if (!animal) {
      return NextResponse.json(
        { error: "Animal not found" },
        { status: 404 }
      );
    }
    
    let result;
    
    switch (action) {
      case "health-check": {
        result = await handleHealthCheck(animalId, animal, notes);
        break;
      }
      case "heat-symptoms": {
        result = await handleHeatSymptoms(animalId, animal, notes);
        break;
      }
      case "insemination": {
        result = await handleInsemination(animalId, animal, notes);
        break;
      }
      case "pregnancy-confirmed": {
        result = await handlePregnancyConfirmed(animalId, animal, notes);
        break;
      }
      case "not-pregnant": {
        result = await handleNotPregnant(animalId, animal, notes);
        break;
      }
      default:
        return NextResponse.json(
          { error: "Invalid action" },
          { status: 400 }
        );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error processing animal event:", error);
    return NextResponse.json(
      { error: "Failed to process animal event" },
      { status: 500 }
    );
  }
}

// Handler for Health Check workflow
async function handleHealthCheck(animalId: string, animal: any, notes?: string) {
  try {
    // 1. Find any pending health check event for this animal
    const pendingEvent = await findPendingEvent(animalId, "HealthCheck");
    
    // 2. If found, mark it as completed
    if (pendingEvent) {
      pendingEvent.status = "Completed";
      pendingEvent.completedDate = new Date();
      pendingEvent.notes = notes || pendingEvent.notes;
      await pendingEvent.save();
    }
    
    // 3. Update the animal's last health check date using findByIdAndUpdate instead of save()
    // This avoids re-validation of the entire document
    await Animal.findByIdAndUpdate(animalId, {
      lastHealthCheckDate: new Date()
    }, { runValidators: false });
    
    // 4. Create a new health check event for 2 weeks later
    const nextCheckDate = addDays(new Date(), 14);
    
    const newEvent = await createEvent({
      eventType: "HealthCheck",
      animalId: new mongoose.Types.ObjectId(animalId),
      title: `Health Check for ${animal.tag}`,
      description: "Regular bi-weekly health examination",
      scheduledDate: nextCheckDate,
      status: "Pending",
      priority: "Medium",
      repeatPattern: "None",
      location: animal.location,
      reminderTime: { value: 1, unit: "day" }
    });
    
    return {
      success: true,
      message: "Health check recorded and next check scheduled",
      nextCheckDate,
      completedEvent: pendingEvent ? pendingEvent._id : null,
      newEvent: newEvent._id
    };
  } catch (error) {
    console.error("Error in handleHealthCheck:", error);
    throw error;
  }
}

// Handler for Heat Symptoms workflow
async function handleHeatSymptoms(animalId: string, animal: any, notes?: string) {
  try {
    // 1. Check if animal is female
    if (animal.gender !== "female") {
      throw new Error("Heat symptoms can only be recorded for female animals");
    }
    
    // 2. Record heat observation as a completed event
    const heatEvent = await createEvent({
      eventType: "HeatObserved",
      animalId: new mongoose.Types.ObjectId(animalId),
      title: `Heat Observed for ${animal.tag}`,
      description: "Heat symptoms observed",
      scheduledDate: new Date(),
      status: "Completed",
      completedDate: new Date(),
      priority: "High",
      notes: notes || "",
      location: animal.location,
    });
    
    // 3. Update the animal's last heat day and status using findByIdAndUpdate
    await Animal.findByIdAndUpdate(animalId, {
      lastHeatDay: new Date(),
      reproductiveStatus: "open"
    }, { runValidators: false });
    
    // 4. Schedule an Insemination event for 12 hours later
    const inseminationDate = addHours(new Date(), 12);
    
    const inseminationEvent = await createEvent({
      eventType: "Insemination",
      animalId: new mongoose.Types.ObjectId(animalId),
      title: `Insemination for ${animal.tag}`,
      description: "Scheduled insemination following observed heat",
      scheduledDate: inseminationDate,
      status: "Pending",
      priority: "High",
      repeatPattern: "None",
      location: animal.location,
      reminderTime: { value: 2, unit: "hour" },
      associatedEvents: [heatEvent._id]
    });
    
    return {
      success: true,
      message: "Heat symptoms recorded and insemination scheduled",
      lastHeatDay: new Date(),
      inseminationDate,
      heatEvent: heatEvent._id,
      inseminationEvent: inseminationEvent._id
    };
  } catch (error) {
    console.error("Error in handleHeatSymptoms:", error);
    throw error;
  }
}

// Handler for Insemination workflow
async function handleInsemination(animalId: string, animal: any, notes?: string) {
  try {
    // 1. Find any pending insemination event for this animal
    const pendingEvent = await findPendingEvent(animalId, "Insemination");
    
    // 2. If found, mark it as completed
    if (pendingEvent) {
      pendingEvent.status = "Completed";
      pendingEvent.completedDate = new Date();
      pendingEvent.notes = notes || pendingEvent.notes;
      await pendingEvent.save();
    }
    
    // 3. Update the animal's insemination date and status using findByIdAndUpdate
    await Animal.findByIdAndUpdate(animalId, {
      lastInseminationDate: new Date(),
      reproductiveStatus: "bred"
    }, { runValidators: false });
    
    // 4. Schedule a pregnancy check for 30 days later
    const pregnancyCheckDate = addDays(new Date(), 30);
    
    const pregnancyCheckEvent = await createEvent({
      eventType: "PregnancyCheck",
      animalId: new mongoose.Types.ObjectId(animalId),
      title: `Pregnancy Check for ${animal.tag}`,
      description: "Verify if insemination was successful",
      scheduledDate: pregnancyCheckDate,
      status: "Pending",
      priority: "High",
      repeatPattern: "None",
      location: animal.location,
      reminderTime: { value: 1, unit: "day" },
      associatedEvents: pendingEvent ? [pendingEvent._id] : []
    });
    
    return {
      success: true,
      message: "Insemination recorded and pregnancy check scheduled",
      lastInseminationDate: new Date(),
      pregnancyCheckDate,
      completedEvent: pendingEvent ? pendingEvent._id : null,
      pregnancyCheckEvent: pregnancyCheckEvent._id
    };
  } catch (error) {
    console.error("Error in handleInsemination:", error);
    throw error;
  }
}

// Handler for Pregnancy Confirmed workflow
async function handlePregnancyConfirmed(animalId: string, animal: any, notes?: string) {
  try {
    // 1. Find any pending pregnancy check event for this animal
    const pendingEvent = await findPendingEvent(animalId, "PregnancyCheck");
    
    // 2. If found, mark it as completed
    if (pendingEvent) {
      pendingEvent.status = "Completed";
      pendingEvent.completedDate = new Date();
      pendingEvent.notes = notes || pendingEvent.notes;
      await pendingEvent.save();
    }
    
    // 3. Update the animal's status using findByIdAndUpdate
    await Animal.findByIdAndUpdate(animalId, {
      reproductiveStatus: "confirmed pregnant"
    }, { runValidators: false });
    
    // 4. Calculate expected calving date (about 280 days after last insemination)
    let expectedCalvingDate;
    if (animal.lastInseminationDate) {
      expectedCalvingDate = addDays(new Date(animal.lastInseminationDate), 280);
      
      // Schedule a dry-off event 60 days before expected calving
      const dryOffDate = addDays(expectedCalvingDate, -60);
      
      const dryOffEvent = await createEvent({
        eventType: "DryOff",
        animalId: new mongoose.Types.ObjectId(animalId),
        title: `Dry Off for ${animal.tag}`,
        description: "Prepare for calving by stopping milking",
        scheduledDate: dryOffDate,
        status: "Pending",
        priority: "High",
        repeatPattern: "None",
        location: animal.location,
        reminderTime: { value: 1, unit: "day" }
      });
      
      // Schedule an expected calving event
      const calvingEvent = await createEvent({
        eventType: "ExpectedCalving",
        animalId: new mongoose.Types.ObjectId(animalId),
        title: `Expected Calving for ${animal.tag}`,
        description: "Prepare for calving",
        scheduledDate: expectedCalvingDate,
        status: "Pending",
        priority: "High",
        repeatPattern: "None",
        location: animal.location,
        reminderTime: { value: 7, unit: "day" }
      });
      
      return {
        success: true,
        message: "Pregnancy confirmed, dry-off and calving events scheduled",
        expectedCalvingDate,
        dryOffDate,
        completedEvent: pendingEvent ? pendingEvent._id : null,
        dryOffEvent: dryOffEvent._id,
        calvingEvent: calvingEvent._id
      };
    }
    
    return {
      success: true,
      message: "Pregnancy confirmed",
      completedEvent: pendingEvent ? pendingEvent._id : null
    };
  } catch (error) {
    console.error("Error in handlePregnancyConfirmed:", error);
    throw error;
  }
}

// Handler for Not Pregnant workflow
async function handleNotPregnant(animalId: string, animal: any, notes?: string) {
  try {
    // 1. Find any pending pregnancy check event for this animal
    const pendingEvent = await findPendingEvent(animalId, "PregnancyCheck");
    
    // 2. If found, mark it as completed
    if (pendingEvent) {
      pendingEvent.status = "Completed";
      pendingEvent.completedDate = new Date();
      pendingEvent.notes = notes || pendingEvent.notes;
      await pendingEvent.save();
    }
    
    // 3. Update the animal's status using findByIdAndUpdate
    await Animal.findByIdAndUpdate(animalId, {
      reproductiveStatus: "open"
    }, { runValidators: false });
    
    return {
      success: true,
      message: "Animal marked as not pregnant and returned to open status",
      completedEvent: pendingEvent ? pendingEvent._id : null
    };
  } catch (error) {
    console.error("Error in handleNotPregnant:", error);
    throw error;
  }
}
