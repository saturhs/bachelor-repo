"use client";

import { useState, useEffect } from "react";
import { Animal } from "@/types/animal";
import { X } from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface LocationFilterProps {
  animals: Animal[];
  onChange: (location: string | null) => void;
  selectedLocation: string | null;
}

export function LocationFilter({ animals, onChange, selectedLocation }: LocationFilterProps) {
  const [locations, setLocations] = useState<string[]>([]);
  
  // Special value for "All Locations"
  const ALL_LOCATIONS = "all";

  // Extract unique locations from animals data
  useEffect(() => {
    try {
      // Filter out empty or undefined locations and get unique values
      const uniqueLocations = Array.from(
        new Set(
          animals
            .map((animal) => animal.location || "")
            .filter((location) => location.trim() !== "")
        )
      ).sort();

      setLocations(uniqueLocations);
    } catch (error) {
      console.error("Error processing location data:", error);
      // Default to empty array if there's an error
      setLocations([]);
    }
  }, [animals]);

  // Handle selection change
  const handleLocationChange = (value: string) => {
    if (value === ALL_LOCATIONS) {
      onChange(null);
    } else {
      onChange(value);
    }
  };

  // Clear filter handler
  const handleClear = () => {
    onChange(null);
  };

  return (
    <div className="w-full flex items-center gap-2">
      <div className="relative w-full">
        <Select 
          value={selectedLocation || ALL_LOCATIONS} 
          onValueChange={handleLocationChange}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Filter by location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_LOCATIONS}>All Locations</SelectItem>
            {locations.map((location) => (
              <SelectItem key={location} value={location}>{location}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Show clear button when a filter is active */}
      {selectedLocation && (
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleClear} 
          className="shrink-0"
          aria-label="Clear filter"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
