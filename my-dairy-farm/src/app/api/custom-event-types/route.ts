import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongodb";
import { CustomEventType } from "@/lib/db/models/CustomEventType";

export async function GET() {
  try {
    await connectToDatabase();
    const customEventTypes = await CustomEventType.find({}).sort({ name: 1 });
    
    // Transform MongoDB documents to match our CustomEventType interface
    const transformedTypes = customEventTypes.map(type => ({
      id: type._id.toString(),
      name: type.name,
      description: type.description,
      defaultPriority: type.defaultPriority,
      reminderTime: type.reminderTime,
      animalCategories: type.animalCategories,
      createdAt: type.createdAt,
      updatedAt: type.updatedAt
    }));

    return NextResponse.json(transformedTypes);
  } catch (error) {
    console.error("Error fetching custom event types:", error);
    return NextResponse.json(
      { error: "Failed to fetch custom event types" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const body = await request.json();
    
    const customEventType = new CustomEventType(body);
    const savedType = await customEventType.save();
    
    // Transform to match our interface
    const transformedType = {
      id: savedType._id.toString(),
      name: savedType.name,
      description: savedType.description,
      defaultPriority: savedType.defaultPriority,
      reminderTime: savedType.reminderTime,
      animalCategories: savedType.animalCategories,
      createdAt: savedType.createdAt,
      updatedAt: savedType.updatedAt
    };

    return NextResponse.json(transformedType, { status: 201 });
  } catch (error: any) {
    console.error("Error creating custom event type:", error);
    
    // Handle duplicate key error specifically
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "A custom event type with this name already exists" },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to create custom event type" },
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
        { error: "Custom Event Type ID is required" },
        { status: 400 }
      );
    }

    const result = await CustomEventType.findByIdAndDelete(id);

    if (!result) {
      return NextResponse.json(
        { error: "Custom Event Type not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting custom event type:", error);
    return NextResponse.json(
      { error: "Failed to delete custom event type" },
      { status: 500 }
    );
  }
}
