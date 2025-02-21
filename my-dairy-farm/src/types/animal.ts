export interface Animal {
    id: string;
    name: string;
    tag: string;
    gender: 'female' | 'male';
    category: 'adult' | 'baby';
    birthDate: Date;
    lastExamination?: Date;
    status: string;
    createdAt: Date;
    updatedAt: Date;
  }