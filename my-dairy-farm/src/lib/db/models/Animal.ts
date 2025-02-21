import mongoose from 'mongoose';

const AnimalSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  tag: {
    type: String,
    required: true,
    unique: true,
  },
  gender: {
    type: String,
    required: true,
    enum: ['female', 'male'],
  },
  category: {
    type: String,
    required: true,
    enum: ['adult', 'baby'],
  },
  birthDate: {
    type: Date,
    required: true,
  },
  lastExamination: {
    type: Date,
    required: false,
  },
  status: {
    type: String,
    required: true,
    default: 'healthy',
  },
}, {
  timestamps: true,
});

export const Animal = mongoose.models.Animal || mongoose.model('Animal', AnimalSchema);
