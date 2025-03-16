export interface Animal {
    id: string;
    tag: string;
    gender: 'female' | 'male';
    birthDate: Date;
    breed?: string;
    acquisitionDate?: Date;
    acquisitionType?: 'born on farm' | 'purchased';
    mothersTag?: string;
    fathersTag?: string;
    currentBCS?: number;
    currentWeight?: number;
    lastHealthCheckDate?: Date;
    lastHeatDay?: Date;
    lastInseminationDate?: Date;
    reproductiveStatus: 'not bred' | 'bred' | 'confirmed pregnant' | 'open' | 'dry';
    notes?: string;
    location?: string;
    tags?: string[];
    category: 'adult' | 'calf';
    createdAt: Date;
    updatedAt: Date;
}