const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ['lost', 'found'],
    },
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
    },
    category: {
      type: String,
      required: true,
      enum: [
        'electronics',
        'clothing',
        'accessories',
        'documents',
        'keys',
        'jewelry',
        'bags',
        'sports',
        'books',
        'tools',
        'toys',
        'other',
      ],
    },
    location: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
    },
    date: {
      type: Date,
      required: true,
    },
    contactInfo: {
      type: String,
      required: true,
      trim: true,
    },
    userId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'found', 'closed'],
      default: 'active',
    },
    reportedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

itemSchema.index({ userId: 1 });
itemSchema.index({ category: 1 });
itemSchema.index({ status: 1 });
itemSchema.index({ reportedAt: -1 });

module.exports = mongoose.model('Item', itemSchema);