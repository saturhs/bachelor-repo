export interface Animal {
    id: string;
    name: string;
    tag: string;
    gender: 'female' | 'male';
    category: 'adult' | 'baby';
    birthDate: Date;
    lastExamination?: Date;
    status: string;
    location?: string;  // Changed field name from object_id to location
    createdAt: Date;
    updatedAt: Date;
}