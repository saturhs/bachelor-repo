"use client"

import { Calendar } from "@/components/ui/calendar"
import { useState } from "react"
import { CalendarEvent, ExaminationType } from "@/types/event"

export function CalendarView() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  // This will be replaced with actual database fetch
  const fetchEvents = async (): Promise<CalendarEvent[]> => {
    return [] // Will be implemented when database is ready
  }

  // Helper function to check event type and return corresponding style
  const getEventStyle = (type: ExaminationType) => {
    switch (type) {
      case 'urgent':
        return { backgroundColor: '#ff4f4f', color: 'white' }
      case 'routine':
        return { backgroundColor: '#4f9fff', color: 'white' }
      case 'follow-up':
        return { backgroundColor: '#4fff4f', color: 'white' }
      default:
        return {}
    }
  }

  // Helper function to check if a date has events
  const isDayMarked = (day: Date, events: CalendarEvent[]) => {
    return events.some(event => 
      event.date.getDate() === day.getDate() &&
      event.date.getMonth() === day.getMonth() &&
      event.date.getFullYear() === day.getFullYear()
    )
  }

  // Helper function to get event type for a specific day
  const getDayEventType = (day: Date, events: CalendarEvent[]): ExaminationType | undefined => {
    const event = events.find(event => 
      event.date.getDate() === day.getDate() &&
      event.date.getMonth() === day.getMonth() &&
      event.date.getFullYear() === day.getFullYear()
    )
    return event?.type
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm shadow-sm p-6 rounded-lg w-full">
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="w-full rounded-md"
        showOutsideDays={true}
        fixedWeeks
        modifiers={{
          hasEvent: (day) => isDayMarked(day, []) // Will pass actual events array here
        }}
        modifiersStyles={{
          hasEvent: { 
            // This will be dynamic based on event type
            backgroundColor: '#ff4f4f',
            color: 'white'
          }
        }}
      />
    </div>
  );
}