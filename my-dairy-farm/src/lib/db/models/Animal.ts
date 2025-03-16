import mongoose from 'mongoose';

// First, clear any previous model to avoid the "model already exists" warning
if (mongoose.models.Animal) {
  delete mongoose.models.Animal;
}

const AnimalSchema = new mongoose.Schema({
  tag: {
    type: String,
    required: true,
    unique: true,
    // Make the validation less strict to accommodate existing data
    // match: /^[A-Z]{2}\d{12}$/ // Original: 2 uppercase letters followed by 12 digits
  },
  gender: {
    type: String,
    required: true,
    enum: ['female', 'male'],
  },
  birthDate: {
    type: Date,
    required: true,
  },
  breed: {
    type: String,
    required: false,
  },
  acquisitionDate: {
    type: Date,
    required: false,
  },
  acquisitionType: {
    type: String,
    required: false,
    enum: ['born on farm', 'purchased'],
  },
  mothersTag: {
    type: String,
    required: false,
  },
  fathersTag: {
    type: String,
    required: false,
  },
  currentBCS: {
    type: Number,
    required: false,
    min: 1,
    max: 5,
  },
  currentWeight: {
    type: Number,
    required: false,
  },
  lastHealthCheckDate: {
    type: Date,
    required: false,
  },
  lastHeatDay: {
    type: Date,
    required: false,
  },
  lastInseminationDate: {
    type: Date,
    required: false,
  },
  reproductiveStatus: {
    type: String,
    required: false,
    enum: ['not bred', 'bred', 'confirmed pregnant', 'open', 'dry'],
    default: 'not bred'
  },
  notes: {
    type: String,
    required: false,
  },
  location: {
    type: String,
    required: false,
  },
  tags: {
    type: [String],
    required: false,
  },
  category: {
    type: String,
    required: true,
    enum: ['adult', 'calf'],
    default: 'adult'
  },
}, {
  timestamps: true,
});

export const Animal = mongoose.model('Animal', AnimalSchema);
