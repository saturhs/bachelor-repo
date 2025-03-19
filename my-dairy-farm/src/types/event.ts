export type EventType = string;

export type EventStatus = 'Pending' | 'Completed' | 'Overdue' | 'Cancelled';
export type EventPriority = 'High' | 'Medium' | 'Low';

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