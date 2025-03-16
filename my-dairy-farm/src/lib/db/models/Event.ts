import mongoose from 'mongoose';

// First, clear any previous model to avoid the "model already exists" warning
if (mongoose.models.Event) {
  delete mongoose.models.Event;
}

const semenDetailsSchema = new mongoose.Schema({
  bullTag: {
    type: String,
    required: false,
  },
  serialNumber: {
    type: String,
    required: false,
  },
  producer: {
    type: String,
    required: false,
  }
}, { _id: false });

const EventSchema = new mongoose.Schema({
  eventType: {
    type: String,
    required: true,
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
  semenDetails: {
    type: semenDetailsSchema,
    required: false,
  },
  // Add new result field for tracking outcomes of events like pregnancy checks
  result: {
    type: String,
    enum: ['positive', 'negative', null],
    default: null
  },
}, {
  timestamps: true,
});

export const Event = mongoose.model('Event', EventSchema);
