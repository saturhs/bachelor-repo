export type EventType = 'HealthCheck' | 'Insemination' | 'HeatObserved' | 'PregnancyCheck' | 'BCSExamination' | 'DryOff' | 'ExpectedCalving';
export type EventStatus = 'Pending' | 'Completed' | 'Overdue' | 'Cancelled';
export type EventPriority = 'High' | 'Medium' | 'Low';
export type RepeatPattern = 'None' | 'Daily' | 'Weekly' | 'Monthly' | 'Custom';
export type TimeUnit = 'minute' | 'hour' | 'day' | 'week';

export interface ReminderTime {
  value: number;
  unit: TimeUnit;
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
  repeatPattern: RepeatPattern;
  repeatInterval?: number;
  reminderTime?: ReminderTime;
  notificationSent: boolean;
  createdBy?: string;
  location?: string;
  completedDate?: Date;
  completedBy?: string;
  notes?: string;
  associatedEvents?: string[];
  createdAt: Date;
  updatedAt: Date;
}