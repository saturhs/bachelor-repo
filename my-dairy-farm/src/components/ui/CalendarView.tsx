"use client";

import { useState, useEffect } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, 
         isSameDay, addMonths, subMonths } from "date-fns";
import { Event } from "@/types/event";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft } from "lucide-react";
import { CustomEventType } from "@/types/customEventType";

// Define the standard event types we want to display in the calendar
const STANDARD_EVENT_TYPES = ['HealthCheck', 'Insemination', 'PregnancyCheck', 'DryOff', 'ExpectedCalving'];
const DEFAULT_LOCATION = "Farm"; // Default location for events with no location

export function CalendarView() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [selectedDayLocations, setSelectedDayLocations] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [totalAnimals, setTotalAnimals] = useState<number>(0);
  const [customEventTypes, setCustomEventTypes] = useState<CustomEventType[]>([]);
  const [availableEventTypes, setAvailableEventTypes] = useState<string[]>([]);
  
  // Fetch events, custom event types, and total animal count
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch events
        const eventsRes = await fetch('/api/events');
        if (!eventsRes.ok) {
          throw new Error('Failed to fetch events');
        }
        const eventsData = await eventsRes.json();
        
        // Fetch custom event types
        const customEventsRes = await fetch('/api/custom-event-types');
        if (!customEventsRes.ok) {
          throw new Error('Failed to fetch custom event types');
        }
        const customEventsData = await customEventsRes.json();
        setCustomEventTypes(customEventsData);
        
        // Extract custom event type names
        const customEventNames = customEventsData.map((eventType: CustomEventType) => eventType.name);
        
        // Combine standard and custom event types for filter options
        setAvailableEventTypes([...STANDARD_EVENT_TYPES, ...customEventNames]);
        
        // Include both standard and custom events
        const allEvents = eventsData.filter((event: Event) => 
          (STANDARD_EVENT_TYPES.includes(event.eventType) || customEventNames.includes(event.eventType)) &&
          event.status === 'Pending'
        );
        
        setEvents(allEvents || []);
        
        // Fetch animal count
        const animalsRes = await fetch('/api/animals');
        if (!animalsRes.ok) {
          throw new Error('Failed to fetch animals');
        }
        const animalsData = await animalsRes.json();
        setTotalAnimals(animalsData.length);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load data. Please try again later.');
        setLoading(false);
        setEvents([]);
      }
    };

    fetchData();
  }, []);

  // Navigate to previous month
  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  // Navigate to next month
  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  // Navigate to current month
  const goToToday = () => {
    setCurrentMonth(new Date());
  };

  // Filter events by selected filter
  const filteredEvents = selectedFilter === "all" 
    ? events 
    : events.filter(event => event.eventType === selectedFilter);

  // Get days in current month
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get events for a specific day
  const getEventsForDay = (day: Date) => {
    return filteredEvents.filter(event => {
      const eventDate = new Date(event.scheduledDate);
      return isSameDay(eventDate, day);
    });
  };

  // Get event count for a specific day (for styling)
  const getEventCountForDay = (day: Date) => {
    return getEventsForDay(day).length;
  };

  // Get color class based on event count relative to total animals
  const getColorForEvents = (count: number) => {
    if (count === 0) return "";
    
    // If there are no animals in the system, use fixed thresholds
    if (totalAnimals === 0) {
      if (count <= 3) return "bg-green-100 hover:bg-green-200";
      if (count <= 7) return "bg-yellow-100 hover:bg-yellow-200";
      return "bg-red-100 hover:bg-red-200";
    }
    
    // Calculate percentage of animals that have events on this day
    const percentage = (count / totalAnimals) * 100;
    
    if (percentage <= 15) return "bg-green-100 hover:bg-green-200";
    if (percentage <= 30) return "bg-yellow-100 hover:bg-yellow-200";
    return "bg-red-100 hover:bg-red-200";
  };

  // Format event date/time
  const formatEventTime = (date: Date) => {
    return format(new Date(date), 'HH:mm');
  };

  // Handle day click - now also calculates available locations for that day
  const handleDayClick = (day: Date) => {
    setSelectedDay(day);
    
    // Get all events for this day
    const dayEvents = filteredEvents.filter(event => {
      const eventDate = new Date(event.scheduledDate);
      return isSameDay(eventDate, day);
    });
    
    // Process events without location
    const eventsWithLocation = dayEvents.map(event => ({
      ...event,
      location: event.location || DEFAULT_LOCATION
    }));
    
    // Extract unique locations from the events (including the default location)
    const locations = Array.from(new Set(eventsWithLocation.map(event => event.location)));
    
    setSelectedDayLocations(locations);
    setSelectedLocation(null);
    setIsDialogOpen(true);
  };
  
  // Group events by animal ID - useful for location view
  const groupEventsByAnimal = (events: Event[]) => {
    const grouped: Record<string, Event[]> = {};
    
    events.forEach(event => {
      const animalId = event.animalId;
      if (!grouped[animalId]) {
        grouped[animalId] = [];
      }
      grouped[animalId].push(event);
    });
    
    return grouped;
  };
  
  // Get events for a location on the selected day
  const getEventsForLocation = (location: string) => {
    if (!selectedDay) return [];
    
    return filteredEvents.filter(event => {
      const eventDate = new Date(event.scheduledDate);
      return isSameDay(eventDate, selectedDay) && 
        (location === DEFAULT_LOCATION ? 
          (!event.location || event.location === DEFAULT_LOCATION) : 
          event.location === location);
    });
  };
  
  // Get unique animal IDs for a location's events
  const getAnimalIdsForLocation = (location: string) => {
    const events = getEventsForLocation(location);
    return Array.from(new Set(events.map(event => event.animalId)));
  };
  
  // Count events for a specific location on selected day
  const getEventCountForLocation = (location: string) => {
    return getEventsForLocation(location).length;
  };

  // Get event type display name (could be customized in the future)
  const getEventTypeDisplayName = (eventType: string) => {
    // For now, just return the event type name
    return eventType;
  };

  return (
    <div className="w-full">
      {error && (
        <div className="bg-red-100 p-4 rounded-md mb-4 text-red-800">
          {error}
        </div>
      )}

      <div className="mb-4 flex justify-between items-center">
        <div className="flex space-x-2">
          <Button variant="outline" onClick={prevMonth}>
            Previous
          </Button>
          <Button variant="outline" onClick={goToToday}>
            Today
          </Button>
          <Button variant="outline" onClick={nextMonth}>
            Next
          </Button>
        </div>
        <h2 className="text-xl font-semibold">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        <div className="w-[200px]">
          <Select
            value={selectedFilter}
            onValueChange={(value) => setSelectedFilter(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter events" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Events</SelectItem>
              {availableEventTypes.map(eventType => (
                <SelectItem key={eventType} value={eventType}>
                  {getEventTypeDisplayName(eventType)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading calendar...</div>
      ) : (
        <>
          {/* Calendar grid - days of week header */}
          <div className="grid grid-cols-7 mb-2 text-center font-semibold">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid - days */}
          <div className="grid grid-cols-7 gap-1">
            {daysInMonth.map((day) => {
              const eventCount = getEventCountForDay(day);
              const colorClass = getColorForEvents(eventCount);
              
              return (
                <div
                  key={day.toString()}
                  onClick={() => handleDayClick(day)}
                  className={`h-24 p-2 border rounded-md cursor-pointer transition-colors ${
                    isSameMonth(day, currentMonth) ? colorClass : 'bg-gray-100 opacity-50'
                  } ${isSameDay(day, new Date()) ? 'border-blue-500 border-2' : 'border-gray-200'}`}
                >
                  <div className="flex justify-between">
                    <span className={`text-sm font-semibold ${isSameDay(day, new Date()) ? 'text-blue-600' : ''}`}>
                      {format(day, 'd')}
                    </span>
                    {eventCount > 0 && (
                      <Badge variant="outline" className="bg-white">{eventCount}</Badge>
                    )}
                  </div>
                  <div className="overflow-hidden text-xs mt-1">
                    {getEventsForDay(day).slice(0, 2).map((event, index) => (
                      <div key={event.id} className="truncate">
                        • {event.title.substring(0, 12)}{event.title.length > 12 ? '...' : ''}
                      </div>
                    ))}
                    {eventCount > 2 && (
                      <div className="text-gray-500">+ {eventCount - 2} more</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Modified Day details dialog */}
      {selectedDay && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {selectedLocation ? (
                  <div className="flex items-center">
                    <Button 
                      variant="ghost" 
                      className="mr-2 h-8 w-8 p-0" 
                      onClick={() => setSelectedLocation(null)}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    Events at {selectedLocation} - {format(selectedDay, 'MMMM d, yyyy')}
                  </div>
                ) : (
                  `Events for ${format(selectedDay, 'MMMM d, yyyy')}`
                )}
              </DialogTitle>
            </DialogHeader>
            <div className="py-4 max-h-[60vh] overflow-y-auto">
              {/* Location selection view */}
              {!selectedLocation && (
                <>
                  {selectedDayLocations.length === 0 ? (
                    <p className="text-gray-500">No events scheduled for this day.</p>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-sm text-gray-600 mb-4">Select a location to view animals:</p>
                      {selectedDayLocations.map(location => (
                        <div 
                          key={location}
                          className="flex justify-between items-center p-3 border rounded-md cursor-pointer hover:bg-gray-50"
                          onClick={() => setSelectedLocation(location)}
                        >
                          <div>
                            <h4 className="font-medium">{location}</h4>
                            <p className="text-sm text-gray-600">
                              {getAnimalIdsForLocation(location).length} animals need attention
                            </p>
                          </div>
                          <Badge>{getEventCountForLocation(location)} events</Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {/* Animal events for selected location */}
              {selectedLocation && (
                <div className="space-y-6">
                  {Object.entries(groupEventsByAnimal(getEventsForLocation(selectedLocation))).map(([animalId, animalEvents]) => (
                    <div key={animalId} className="border rounded-md p-4">
                      <h3 className="font-semibold text-lg border-b pb-2 mb-3">Animal ID: {animalId}</h3>
                      <div className="space-y-3">
                        {animalEvents.map((event) => (
                          <div key={event.id} className="border-t border-gray-100 pt-3">
                            <div className="flex justify-between">
                              <h4 className="font-medium">{event.title}</h4>
                              <Badge 
                                className={
                                  event.priority === 'High' ? 'bg-red-100 text-red-800 hover:bg-red-200' :
                                  event.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' :
                                  'bg-green-100 text-green-800 hover:bg-green-200'
                                }
                              >
                                {event.priority}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Time:</span> {formatEventTime(event.scheduledDate)}
                            </p>
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Type:</span> {event.eventType}
                            </p>
                            {event.description && (
                              <p className="text-sm text-gray-600">
                                <span className="font-medium">Description:</span> {event.description}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <DialogFooter>
              <Button onClick={() => {
                setSelectedLocation(null);
                setIsDialogOpen(false);
              }} variant="outline">
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}