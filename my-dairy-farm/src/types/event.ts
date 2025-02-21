export type ExaminationType = 'routine' | 'urgent' | 'follow-up';

export interface CalendarEvent {
  id: string;
  date: Date;
  cowId: string;
  type: ExaminationType;
  description: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}