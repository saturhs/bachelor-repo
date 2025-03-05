"use client";

import { Navbar } from "@/components/ui/Navbar";
import { GoBack } from "@/components/ui/Goback";
import { AnimalCard } from "@/components/ui/AnimalCard";
import { AddAnimalForm } from "@/components/ui/AddAnimalForm";
import { LocationFilter } from "@/components/ui/LocationFilter";
import { Animal } from "@/types/animal";
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AnimalsPage() {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnimals = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/animals');
        if (!res.ok) {
          throw new Error('Failed to fetch animals');
        }
        const data = await res.json();
        setAnimals(data);
      } catch (error) {
        console.error('Error fetching animals:', error);
        setError('Failed to load animals. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAnimals();
  }, []);

  // Filter animals by location first if a location is selected
  const filteredByLocation = selectedLocation
    ? animals.filter(animal => animal.location === selectedLocation)
    : animals;
  
  // Then filter by category and gender
  const females = filteredByLocation.filter(animal => animal.gender === 'female' && animal.category === 'adult');
  const males = filteredByLocation.filter(animal => animal.gender === 'male' && animal.category === 'adult');
  const calves = filteredByLocation.filter(animal => animal.category === 'baby');

  return (
    <main className="min-h-screen bg-[#faf9f6] relative">
      <Navbar />
      <GoBack />
      <div className="flex flex-col items-center justify-start pt-4 pb-16">
        <h1 className="text-5xl font-bold mb-8">Animals</h1>

        <div className="w-[95%] md:w-[80%] lg:w-[60%] max-w-4xl mx-auto mb-6">
          {/* Updated filter and add button layout */}
          {!loading && !error && (
            <div className="mb-4 flex flex-col md:flex-row gap-4 items-stretch">
              <div className="w-full md:flex-1">
                <LocationFilter 
                  animals={animals} 
                  onChange={setSelectedLocation} 
                  selectedLocation={selectedLocation} 
                />
              </div>
              <div className="w-full md:w-[180px] flex items-stretch"> {/* Fixed width with flex */}
                <AddAnimalForm />
              </div>
            </div>
          )}
          
          <Tabs defaultValue="females" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="females">Females</TabsTrigger>
              <TabsTrigger value="males">Males</TabsTrigger>
              <TabsTrigger value="calves">Calves</TabsTrigger>
            </TabsList>

            {/* Loading State */}
            {loading && (
              <div className="w-full text-center py-8">
                <p className="text-gray-600">Loading animals...</p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="w-full text-center py-8">
                <p className="text-red-600">{error}</p>
              </div>
            )}

            {!loading && !error && (
              <>
                <TabsContent value="females">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    {females.length > 0 ? (
                      females.map((animal, index) => (
                        <AnimalCard key={`female-${animal.id}-${index}`} animal={animal} />
                      ))
                    ) : (
                      <p className="text-center col-span-2 py-8 text-gray-600">
                        {selectedLocation ? 
                          `No females found in ${selectedLocation}.` : 
                          'No females found. Add your first female cow by clicking the button below.'}
                      </p>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="males">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    {males.length > 0 ? (
                      males.map((animal, index) => (
                        <AnimalCard key={`male-${animal.id}-${index}`} animal={animal} />
                      ))
                    ) : (
                      <p className="text-center col-span-2 py-8 text-gray-600">
                        {selectedLocation ? 
                          `No males found in ${selectedLocation}.` : 
                          'No males found. Add your first male cow by clicking the button below.'}
                      </p>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="calves">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    {calves.length > 0 ? (
                      calves.map((animal, index) => (
                        <AnimalCard key={`calf-${animal.id}-${index}`} animal={animal} />
                      ))
                    ) : (
                      <p className="text-center col-span-2 py-8 text-gray-600">
                        {selectedLocation ? 
                          `No calves found in ${selectedLocation}.` : 
                          'No calves found. Add your first calf by clicking the button below.'}
                      </p>
                    )}
                  </div>
                </TabsContent>
              </>
            )}
          </Tabs>
        </div>
      </div>
    </main>
  );
}