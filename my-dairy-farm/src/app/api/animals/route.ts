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
    object_id: animal.object_id || '',
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
    
    // Use a simpler approach for getting the body
    const body = await request.json();
    
    console.log("Request body received:", body);
    console.log("object_id value:", body.object_id);
    
    // Create a new animal with our model directly
    const newAnimal = new Animal({
      name: body.name,
      tag: body.tag,
      gender: body.gender,
      category: body.category,
      birthDate: body.birthDate,
      status: body.status || 'healthy',
      object_id: body.object_id || '',
      lastExamination: body.lastExamination || null
    });
    
    console.log("Animal instance before save:", {
      ...newAnimal.toObject(),
      object_id: newAnimal.get('object_id')
    });
    
    // Save the animal
    await newAnimal.save();
    
    console.log("Saved animal:", {
      ...newAnimal.toObject(),
      object_id: newAnimal.get('object_id')
    });
    
    // Return the transformed animal
    const transformedAnimal = transformAnimal(newAnimal);
    console.log("Transformed animal:", transformedAnimal);
    
    return NextResponse.json(transformedAnimal, { status: 201 });
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