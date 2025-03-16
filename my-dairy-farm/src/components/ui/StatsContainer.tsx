"use client";

import { useEffect, useState } from "react";

// Standard event types to include (matching CalendarView.tsx)
const STANDARD_EVENT_TYPES = ['HealthCheck', 'Insemination', 'PregnancyCheck', 'DryOff', 'ExpectedCalving'];

export function StatsContainer() {
    const [animalCount, setAnimalCount] = useState<number>(0);
    const [eventsCount, setEventsCount] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
      const fetchStats = async () => {
        try {
          setIsLoading(true);
          
          // Fetch total animal count
          const animalsResponse = await fetch('/api/animals');
          if (!animalsResponse.ok) {
            throw new Error('Failed to fetch animals');
          }
          const animals = await animalsResponse.json();
          
          // Fetch custom event types to know which ones to include
          const customEventsResponse = await fetch('/api/custom-event-types');
          if (!customEventsResponse.ok) {
            throw new Error('Failed to fetch custom event types');
          }
          const customEventTypes = await customEventsResponse.json();
          
          // Extract custom event type names
          const customEventNames = customEventTypes.map((eventType: any) => eventType.name);
          
          // Fetch today's events
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const tomorrow = new Date(today);
          tomorrow.setDate(tomorrow.getDate() + 1);
          
          const eventsResponse = await fetch(`/api/events?startDate=${today.toISOString()}&endDate=${tomorrow.toISOString()}&status=Pending`);
          if (!eventsResponse.ok) {
            throw new Error('Failed to fetch events');
          }
          const events = await eventsResponse.json();
          
          // Filter events to include only those that would appear on the calendar
          const filteredEvents = events.filter((event: any) => 
            (STANDARD_EVENT_TYPES.includes(event.eventType) || customEventNames.includes(event.eventType)) &&
            event.status === 'Pending'
          );
          
          setAnimalCount(animals.length);
          setEventsCount(filteredEvents.length);
        } catch (err) {
          console.error('Error fetching stats:', err);
          setError('Failed to load statistics');
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchStats();
    }, []);

    return (
      <div className="w-full py-16 bg-white/80 backdrop-blur-sm shadow-sm">
        <div className="max-w-6xl mx-auto grid grid-cols-2 gap-8">
          <div className="text-center p-6 rounded-lg hover:bg-gray-50 transition-colors">
            <h2 className="text-4xl font-bold mb-2">
              {isLoading ? (
                <span className="text-gray-400">...</span>
              ) : error ? (
                <span className="text-red-400">—</span>
              ) : (
                animalCount
              )}
            </h2>
            <p className="text-gray-600">Total Animals</p>
          </div>
          <div className="text-center p-6 rounded-lg hover:bg-gray-50 transition-colors">
            <h2 className="text-4xl font-bold mb-2">
              {isLoading ? (
                <span className="text-gray-400">...</span>
              ) : error ? (
                <span className="text-red-400">—</span>
              ) : (
                eventsCount
              )}
            </h2>
            <p className="text-gray-600">Events Today</p>
          </div>
        </div>
      </div>
    );
  }