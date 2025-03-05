import { connectToDatabase } from '@/lib/db/mongodb';
import { Animal } from '@/lib/db/models/Animal';
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

// Helper function to transform MongoDB document to our frontend model
function transformAnimal(animal: any) {
  return {
    id: animal._id.toString(),
    name: animal.name,
    tag: animal.tag,
    gender: animal.gender,
    category: animal.category,
    birthDate: animal.birthDate,
    lastExamination: animal.lastExamination,
    status: animal.status,
    location: animal.location || '',  // Changed field name from object_id to location
    createdAt: animal.createdAt,
    updatedAt: animal.updatedAt
  };
}

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    
    // Check if there's an id query parameter
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    // If there's an ID, return a single animal
    if (id) {
      // Validate the ID format
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json({ error: 'Invalid animal ID format' }, { status: 400 });
      }
      
      const animal = await Animal.findById(id);
      
      if (!animal) {
        return NextResponse.json({ error: 'Animal not found' }, { status: 404 });
      }
      
      return NextResponse.json(transformAnimal(animal));
    }
    
    // Otherwise return all animals
    const animals = await Animal.find();
    return NextResponse.json(animals.map(transformAnimal));
  } catch (error) {
    console.error('Error fetching animals:', error);
    return NextResponse.json({ error: 'Failed to fetch animals' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    
    // Log the raw request for debugging
    const text = await request.text();
    console.log("Raw request body:", text);
    
    // Parse the JSON
    const body = JSON.parse(text);
    console.log("Parsed body:", body);
    console.log("Location field:", body.location);
    
    // Create a new animal document with explicit field assignment
    const newAnimal = new Animal({
      name: body.name,
      tag: body.tag,
      gender: body.gender,
      category: body.category,
      birthDate: body.birthDate,
      status: body.status || 'healthy',
      location: body.location || '', // Explicitly assign location
      lastExamination: body.lastExamination || null
    });
    
    console.log("Animal object before save:", newAnimal);
    
    // Pre-save hook to ensure location is set
    newAnimal.schema.pre('save', function() {
      if (this.isNew && body.location) {
        this.location = body.location;
      }
    });
    
    // Save the document
    await newAnimal.save();
    
    // Log what was saved
    console.log("Saved animal:", newAnimal);
    console.log("Location after save:", newAnimal.location);
    
    // Use our transform function
    const transformed = transformAnimal(newAnimal);
    console.log("Transformed for response:", transformed);
    
    return NextResponse.json(transformed, { status: 201 });
  } catch (error) {
    console.error('Error creating animal:', error);
    return NextResponse.json({ error: 'Failed to create animal' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    
    // Make sure we have an id to update
    if (!body._id) {
      return NextResponse.json({ error: 'Animal ID is required' }, { status: 400 });
    }
    
    const updatedAnimal = await Animal.findByIdAndUpdate(
      body._id,
      { $set: body },
      { new: true, runValidators: true }
    );
    
    if (!updatedAnimal) {
      return NextResponse.json({ error: 'Animal not found' }, { status: 404 });
    }
    
    return NextResponse.json(transformAnimal(updatedAnimal));
  } catch (error) {
    console.error('Error updating animal:', error);
    return NextResponse.json({ error: 'Failed to update animal' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await connectToDatabase();
    
    // Get the ID from the URL
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Animal ID is required' }, { status: 400 });
    }
    
    // Check if the ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid animal ID format' }, { status: 400 });
    }
    
    const deletedAnimal = await Animal.findByIdAndDelete(id);
    
    if (!deletedAnimal) {
      return NextResponse.json({ error: 'Animal not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Animal deleted successfully' });
  } catch (error) {
    console.error('Error deleting animal:', error);
    return NextResponse.json({ error: 'Failed to delete animal' }, { status: 500 });
  }
}