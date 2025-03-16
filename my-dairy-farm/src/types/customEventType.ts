export type AnimalCategory = 'adult female' | 'adult male' | 'calf';
export type EventPriority = 'High' | 'Medium' | 'Low';

export interface ReminderTime {
  value: number;
  unit: 'hour' | 'day' | 'week' | 'month';
}

export interface CustomEventType {
  id: string;
  name: string;
  description?: string;
  defaultPriority: EventPriority;
  reminderTime: ReminderTime;
  animalCategories: AnimalCategory[];
  createdAt: Date;
  updatedAt: Date;
}
