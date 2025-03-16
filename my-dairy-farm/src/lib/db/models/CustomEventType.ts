import mongoose from 'mongoose';

// Clear any previous model to avoid the "model already exists" warning
if (mongoose.models.CustomEventType) {
  delete mongoose.models.CustomEventType;
}

const reminderTimeSchema = new mongoose.Schema({
  value: {
    type: Number,
    required: true,
  },
  unit: {
    type: String,
    required: true,
    enum: ['hour', 'day', 'week', 'month'], 
  }
}, { _id: false });

const CustomEventTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: false,
    maxlength: 500,
    trim: true,
  },
  defaultPriority: {
    type: String,
    required: true,
    enum: ['High', 'Medium', 'Low'],
    default: 'Medium',
  },
  reminderTime: {
    type: reminderTimeSchema,
    required: true, // Changed to required since we need it for scheduling
  },
  animalCategories: {
    type: [{
      type: String,
      enum: ['adult female', 'adult male', 'calf'],
    }],
    required: true,
    validate: {
      validator: function(v: string[]) {
        return v.length > 0;
      },
      message: 'At least one animal category must be selected',
    }
  },
}, {
  timestamps: true,
});

export const CustomEventType = mongoose.models.CustomEventType || 
  mongoose.model('CustomEventType', CustomEventTypeSchema);
