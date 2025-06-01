const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  participants: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    joinedAt: {
      type: Date,
      default: Date.now
    },
    lastSeen: {
      type: Date,
      default: Date.now
    }
  }],
  relatedItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    required: false
  },
  lastMessage: {
    content: String,
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  },
  unreadCount: {
    type: Map,
    of: Number,
    default: {}
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Ensure only two participants per conversation
conversationSchema.pre('save', function(next) {
  if (this.participants.length > 2) {
    next(new Error('A conversation can only have 2 participants'));
  }
  next();
});

// Index for better query performance
conversationSchema.index({ 'participants.user': 1 });
conversationSchema.index({ relatedItem: 1 });
conversationSchema.index({ 'lastMessage.timestamp': -1 });

// Method to get the other participant
conversationSchema.methods.getOtherParticipant = function(userId) {
  return this.participants.find(p => !p.user.equals(userId));
};

module.exports = mongoose.model('Conversation', conversationSchema);