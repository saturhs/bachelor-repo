import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongodb";
import { Event } from "@/lib/db/models/Event";
import { Animal } from "@/lib/db/models/Animal";
import { addDays, addHours } from "date-fns";

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const animalId = searchParams.get("animalId");
    const status = searchParams.get("status");
    const eventType = searchParams.get("eventType");
    
    // Build query object
    const query: Record<string, any> = {};
    if (animalId) query.animalId = animalId;
    if (status) query.status = status;
    if (eventType) query.eventType = eventType;
    
    const events = await Event.find(query).sort({ scheduledDate: 1 });
    
    // Transform MongoDB documents to match our Event interface
    const transformedEvents = events.map(event => ({
      id: event._id ? event._id.toString() : '',
      eventType: event.eventType || '',
      animalId: event.animalId ? event.animalId.toString() : '', // Add null check here
      title: event.title || '',
      description: event.description || '',
      scheduledDate: event.scheduledDate || new Date(),
      status: event.status || 'Pending',
      priority: event.priority || 'Medium',
      repeatPattern: event.repeatPattern || 'None',
      repeatInterval: event.repeatInterval,
      reminderTime: event.reminderTime,
      notificationSent: event.notificationSent || false,
      createdBy: event.createdBy ? event.createdBy.toString() : '',
      location: event.location || '',
      completedDate: event.completedDate,
      completedBy: event.completedBy ? event.completedBy.toString() : '',
      notes: event.notes || '',
      associatedEvents: event.associatedEvents ? event.associatedEvents.map(id => id ? id.toString() : '') : [],
      createdAt: event.createdAt || new Date(),
      updatedAt: event.updatedAt || new Date()
    }));

    return NextResponse.json(transformedEvents);
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const body = await request.json();
    
    const event = new Event(body);
    const savedEvent = await event.save();
    
    // Transform to match our interface
    const transformedEvent = {
      id: savedEvent._id.toString(),
      eventType: savedEvent.eventType,
      animalId: savedEvent.animalId.toString(),
      // ... other fields ...
      createdAt: savedEvent.createdAt,
      updatedAt: savedEvent.updatedAt
    };
    
    return NextResponse.json(transformedEvent, { status: 201 });
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json(
      { error: "Failed to create event" },
      { status: 500 }
    );
  }
}