import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongodb";
import { Animal } from "@/lib/db/models/Animal";

export async function GET() {
  try {
    await connectToDatabase();
    const animals = await Animal.find({});
    
    // Transform MongoDB documents to match our Animal interface
    const transformedAnimals = animals.map(animal => ({
      id: animal._id.toString(),
      tag: animal.tag,
      gender: animal.gender,
      birthDate: animal.birthDate,
      breed: animal.breed,
      acquisitionDate: animal.acquisitionDate,
      acquisitionType: animal.acquisitionType,
      mothersTag: animal.mothersTag,
      fathersTag: animal.fathersTag,
      currentBCS: animal.currentBCS,
      currentWeight: animal.currentWeight,
      lastHealthCheckDate: animal.lastHealthCheckDate,
      lastHeatDay: animal.lastHeatDay,
      lastInseminationDate: animal.lastInseminationDate,
      reproductiveStatus: animal.reproductiveStatus || 'not bred',
      lactationStatus: animal.lactationStatus || 'not applicable',
      notes: animal.notes,
      location: animal.location,
      tags: animal.tags || [],
      category: animal.category,
      createdAt: animal.createdAt,
      updatedAt: animal.updatedAt
    }));

    return NextResponse.json(transformedAnimals);
  } catch (error) {
    console.error("Error fetching animals:", error);
    return NextResponse.json(
      { error: "Failed to fetch animals" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const rawBody = await request.text();
    console.log("Raw request body:", rawBody);
    
    const body = JSON.parse(rawBody);
    console.log("Parsed body:", body);
    
    // Create a new animal with all the fields from the form
    const animalData: Record<string, any> = {
      tag: body.tag,
      gender: body.gender,
      birthDate: body.birthDate,
      breed: body.breed || undefined,
      acquisitionDate: body.acquisitionDate || undefined,
      acquisitionType: body.acquisitionType || undefined,
      mothersTag: body.mothersTag || undefined,
      fathersTag: body.fathersTag || undefined,
      currentBCS: body.currentBCS ? Number(body.currentBCS) : undefined,
      currentWeight: body.currentWeight ? Number(body.currentWeight) : undefined,
      lastHealthCheckDate: body.lastHealthCheckDate || undefined,
      lastHeatDay: body.lastHeatDay || undefined,
      lastInseminationDate: body.lastInseminationDate || undefined,
      reproductiveStatus: body.reproductiveStatus || 'not bred',
      lactationStatus: body.lactationStatus || 'not applicable',
      notes: body.notes || undefined,
      location: body.location || undefined,
      category: body.category || 'adult'
    };
    
    // Clean up the data by removing undefined values and empty strings
    const cleanAnimalData = Object.entries(animalData).reduce((acc, [key, value]) => {
      // Skip undefined values
      if (value === undefined) {
        return acc;
      }
      
      // Skip empty strings
      if (typeof value === 'string' && value.trim() === '') {
        return acc;
      }
      
      // Keep valid values
      acc[key] = value;
      return acc;
    }, {} as Record<string, any>);
    
    console.log("Animal object before save:", cleanAnimalData);
    
    const animal = new Animal(cleanAnimalData);
    const savedAnimal = await animal.save();
    
    console.log("Saved animal:", savedAnimal);
    console.log("Location after save:", savedAnimal.location);
    
    // Transform to match our interface
    const transformedAnimal = {
      id: savedAnimal._id.toString(),
      tag: savedAnimal.tag,
      gender: savedAnimal.gender,
      birthDate: savedAnimal.birthDate,
      breed: savedAnimal.breed,
      acquisitionDate: savedAnimal.acquisitionDate,
      acquisitionType: savedAnimal.acquisitionType,
      mothersTag: savedAnimal.mothersTag,
      fathersTag: savedAnimal.fathersTag,
      currentBCS: savedAnimal.currentBCS,
      currentWeight: savedAnimal.currentWeight,
      lastHealthCheckDate: savedAnimal.lastHealthCheckDate,
      lastHeatDay: savedAnimal.lastHeatDay,
      lastInseminationDate: savedAnimal.lastInseminationDate,
      reproductiveStatus: savedAnimal.reproductiveStatus,
      lactationStatus: savedAnimal.lactationStatus,
      notes: savedAnimal.notes,
      location: savedAnimal.location,
      tags: savedAnimal.tags || [],
      category: savedAnimal.category,
      createdAt: savedAnimal.createdAt,
      updatedAt: savedAnimal.updatedAt
    };
    
    console.log("Transformed for response:", transformedAnimal);

    return NextResponse.json(transformedAnimal, { status: 201 });
  } catch (error) {
    console.error("Error creating animal:", error);
    return NextResponse.json(
      { error: "Failed to create animal" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Animal ID is required" },
        { status: 400 }
      );
    }

    const result = await Animal.findByIdAndDelete(id);

    if (!result) {
      return NextResponse.json(
        { error: "Animal not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting animal:", error);
    return NextResponse.json(
      { error: "Failed to delete animal" },
      { status: 500 }
    );
  }
}