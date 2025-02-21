import mongoose from 'mongoose';

const EventSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  cowId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Animal',
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ['routine', 'urgent', 'follow-up'],
  },
  description: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

export const Event = mongoose.models.Event || mongoose.model('Event', EventSchema);
