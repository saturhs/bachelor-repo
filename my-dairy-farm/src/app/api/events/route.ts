import { connectToDatabase } from '@/lib/db/mongodb';
import { Event } from '@/lib/db/models/Event';
import { NextResponse } from 'next/server';

export async function GET() {
  await connectToDatabase();
  const events = await Event.find();
  return NextResponse.json(events);
}

export async function POST(request: Request) {
  await connectToDatabase();
  const body = await request.json(); // Parse the JSON body
  const newEvent = new Event(body);
  await newEvent.save();
  return NextResponse.json(newEvent, { status: 201 });
}