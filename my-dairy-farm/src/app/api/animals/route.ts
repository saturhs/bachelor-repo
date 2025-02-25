import { connectToDatabase } from '@/lib/db/mongodb';
import { Animal } from '@/lib/db/models/Animal';
import { NextResponse } from 'next/server';

export async function GET() {
  await connectToDatabase();
  const animals = await Animal.find();
  return NextResponse.json(animals);
}

export async function POST(request: Request) {
  await connectToDatabase();
  const body = await request.json(); // Parse the JSON body
  const newAnimal = new Animal(body);
  await newAnimal.save();
  return NextResponse.json(newAnimal, { status: 201 });
}