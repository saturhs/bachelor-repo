"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function DataExport() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleExport = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccess(null);

      // Fetch all animals
      const animalsResponse = await fetch('/api/animals');
      if (!animalsResponse.ok) {
        throw new Error('Failed to fetch animals');
      }
      const animals = await animalsResponse.json();

      // Fetch events for each animal
      const animalData = await Promise.all(
        animals.map(async (animal: any) => {
          const eventsResponse = await fetch(`/api/animal-events?animalId=${animal.id}`);
          if (!eventsResponse.ok) {
            throw new Error(`Failed to fetch events for animal ${animal.id}`);
          }
          const events = await eventsResponse.json();
          
          return {
            ...animal,
            events: events
          };
        })
      );

      // Create a downloadable JSON file
      const dataStr = JSON.stringify(animalData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      
      // Create download link and trigger download
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      
      // Format date for filename
      const date = new Date();
      const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD
      
      link.download = `my-dairy-farm-data-${dateStr}.json`;
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      setSuccess("Farm data exported successfully!");
    } catch (err) {
      console.error('Error exporting data:', err);
      setError(err instanceof Error ? err.message : 'Failed to export data');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <h3 className="text-lg font-medium mb-4">Export Farm Data</h3>
        <p className="text-gray-600 mb-6">
          Download all farm data as a JSON file, including animals and their associated events.
          You can use this file for record-keeping or as a backup.
        </p>
        
        <Button 
          onClick={handleExport} 
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Exporting...
            </>
          ) : (
            <>
              <Download className="h-4 w-4" />
              Export Data (JSON)
            </>
          )}
        </Button>
        
        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {success && (
          <Alert className="mt-4 bg-green-50 text-green-800 border-green-200">
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}
