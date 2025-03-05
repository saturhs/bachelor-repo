import mongoose from 'mongoose';

// First, clear any previous model to avoid the "model already exists" warning
if (mongoose.models.Animal) {
  delete mongoose.models.Animal;
}

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
  location: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

// Add pre-save hook to ensure location is preserved
AnimalSchema.pre('save', function(next) {
  // Ensure location is set properly
  if (this.isModified('location')) {
    console.log("Setting location during save:", this.location);
  }
  next();
});

export const Animal = mongoose.model('Animal', AnimalSchema);
