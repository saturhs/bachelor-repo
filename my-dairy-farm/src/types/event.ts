export type EventType = string;

export type EventStatus = 'Pending' | 'Completed' | 'Overdue' | 'Cancelled';
export type EventPriority = 'High' | 'Medium' | 'Low';

// Remove ReminderTime interface since it's no longer used

export interface SemenDetails {
  bullTag?: string;
  serialNumber?: string;
  producer?: string;
}

export interface Event {
  id: string;
  eventType: EventType;
  animalId: string;
  title: string;
  description?: string;
  scheduledDate: Date;
  status: EventStatus;
  priority: EventPriority;
  // Removed repeatPattern, repeatInterval and reminderTime
  notificationSent: boolean;
  createdBy?: string;
  location?: string;
  completedDate?: Date;
  completedBy?: string;
  notes?: string;
  associatedEvents?: string[];
  semenDetails?: SemenDetails;
  createdAt: Date;
  updatedAt: Date;
}