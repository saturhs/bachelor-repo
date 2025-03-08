import mongoose from 'mongoose';

// First, clear any previous model to avoid the "model already exists" warning
if (mongoose.models.Event) {
  delete mongoose.models.Event;
}

const reminderTimeSchema = new mongoose.Schema({
  value: {
    type: Number,
    required: true,
  },
  unit: {
    type: String,
    required: true,
    enum: ['minute', 'hour', 'day', 'week'],
  }
}, { _id: false });

const EventSchema = new mongoose.Schema({
  eventType: {
    type: String,
    required: true,
    enum: ['HealthCheck', 'Insemination', 'HeatObserved', 'PregnancyCheck', 'BCSExamination', 'DryOff', 'ExpectedCalving'],
  },
  animalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Animal',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  scheduledDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ['Pending', 'Completed', 'Overdue', 'Cancelled'],
    default: 'Pending',
  },
  priority: {
    type: String,
    required: true,
    enum: ['High', 'Medium', 'Low'],
    default: 'Medium',
  },
  repeatPattern: {
    type: String,
    required: false,
    enum: ['None', 'Daily', 'Weekly', 'Monthly', 'Custom'],
    default: 'None',
  },
  repeatInterval: {
    type: Number,
    required: false,
    min: 1,
  },
  reminderTime: {
    type: reminderTimeSchema,
    required: false,
  },
  notificationSent: {
    type: Boolean,
    default: false,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false, // Making this optional until we have user authentication
  },
  location: {
    type: String,
    required: false,
  },
  completedDate: {
    type: Date,
    required: false,
  },
  completedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
  },
  notes: {
    type: String,
    required: false,
  },
  associatedEvents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
  }],
}, {
  timestamps: true,
});

export const Event = mongoose.model('Event', EventSchema);
