"use client";

import { useState, useEffect } from "react";
import { CustomEventType } from "@/types/customEventType";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function CustomEventsList({ refreshTrigger }: { refreshTrigger: number }) {
  const [events, setEvents] = useState<CustomEventType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [eventToDelete, setEventToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchCustomEvents = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/custom-event-types');
        
        if (!res.ok) {
          throw new Error('Failed to fetch custom event types');
        }
        
        const data = await res.json();
        setEvents(data);
      } catch (error: any) {
        console.error('Error fetching custom event types:', error);
        setError(error.message || 'Failed to load custom event types');
      } finally {
        setLoading(false);
      }
    };

    fetchCustomEvents();
  }, [refreshTrigger]);

  const handleDelete = async () => {
    if (!eventToDelete) return;
    
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/custom-event-types?id=${eventToDelete}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete custom event type');
      }
      
      // Update local state to remove the deleted event
      setEvents(prevEvents => prevEvents.filter(event => event.id !== eventToDelete));
    } catch (error: any) {
      console.error('Error deleting custom event type:', error);
      setError(error.message || 'Failed to delete custom event type');
    } finally {
      setIsDeleting(false);
      setEventToDelete(null);
    }
  };

  // Add helper function to format reminder time
  const formatReminderTime = (reminderTime: { value: number; unit: string }) => {
    const { value, unit } = reminderTime;
    return `${value} ${value === 1 ? unit : unit + 's'}`;
  };

  if (loading) {
    return <div className="text-center py-8">Loading custom event types...</div>;
  }

  if (error) {
    return <div className="bg-red-100 p-4 rounded-md text-red-800">{error}</div>;
  }

  if (events.length === 0) {
    return <div className="text-center py-8 text-gray-500">No custom event types defined yet.</div>;
  }

  return (
    <div className="space-y-4">
      {events.map((event) => (
        <div 
          key={event.id} 
          className="bg-white/80 backdrop-blur-sm shadow-sm p-6 rounded-lg border border-gray-200"
        >
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="text-lg font-semibold">{event.name}</h3>
              {event.description && <p className="text-sm text-gray-500">{event.description}</p>}
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-red-500 hover:text-red-700 hover:bg-red-50"
              onClick={() => setEventToDelete(event.id)}
            >
              Delete
            </Button>
          </div>
          <div className="text-sm space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-medium">Priority:</span>
              <Badge
                className={
                  event.defaultPriority === 'High' ? 'bg-red-100 text-red-800' :
                  event.defaultPriority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }
              >
                {event.defaultPriority}
              </Badge>
            </div>
            
            <div>
              <span className="font-medium">Interval:</span> {formatReminderTime(event.reminderTime)}
            </div>
            
            <div>
              <span className="font-medium">Applies to:</span>{' '}
              {event.animalCategories.map((category, i) => (
                <span key={category}>
                  {category}
                  {i < event.animalCategories.length - 1 ? ', ' : ''}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}
      
      <AlertDialog open={Boolean(eventToDelete)} onOpenChange={(open) => !open && setEventToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this custom event type and cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
