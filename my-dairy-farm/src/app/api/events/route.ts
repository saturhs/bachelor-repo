import { connectToDatabase } from '@/lib/db/mongodb';
import { Event } from '@/lib/db/models/Event';
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    
    // Check if there's an id query parameter
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    // If there's an ID, return a single event
    if (id) {
      // Validate the ID format
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json({ error: 'Invalid event ID format' }, { status: 400 });
      }
      
      const event = await Event.findById(id);
      
      if (!event) {
        return NextResponse.json({ error: 'Event not found' }, { status: 404 });
      }
      
      return NextResponse.json(event);
    }
    
    // Otherwise return all events
    const events = await Event.find();
    return NextResponse.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  await connectToDatabase();
  const body = await request.json(); // Parse the JSON body
  const newEvent = new Event(body);
  await newEvent.save();
  return NextResponse.json(newEvent, { status: 201 });
}

export async function PUT(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    
    // Make sure we have an id to update
    if (!body._id) {
      return NextResponse.json({ error: 'Event ID is required' }, { status: 400 });
    }
    
    const updatedEvent = await Event.findByIdAndUpdate(
      body._id,
      { $set: body },
      { new: true, runValidators: true }
    );
    
    if (!updatedEvent) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }
    
    return NextResponse.json(updatedEvent);
  } catch (error) {
    console.error('Error updating event:', error);
    return NextResponse.json({ error: 'Failed to update event' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await connectToDatabase();
    
    // Get the ID from the URL
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Event ID is required' }, { status: 400 });
    }
    
    // Check if the ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid event ID format' }, { status: 400 });
    }
    
    const deletedEvent = await Event.findByIdAndDelete(id);
    
    if (!deletedEvent) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event:', error);
    return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 });
  }
}