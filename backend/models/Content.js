const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['article', 'book', 'lecture', 'prayer', 'hadith', 'quran'],
    required: true
  },
  category: {
    type: String,
    enum: ['islamic-studies', 'spirituality', 'prayers', 'lectures', 'quran', 'hadith', 'general'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  media: {
    thumbnail: String,
    audio: String,
    video: String,
    pdf: String
  },
  metadata: {
    duration: Number,
    pages: Number,
    language: {
      type: String,
      default: 'english'
    },
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner'
    }
  },
  stats: {
    views: {
      type: Number,
      default: 0
    },
    likes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    bookmarks: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    shares: {
      type: Number,
      default: 0
    }
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  publishedAt: Date
}, {
  timestamps: true
});

module.exports = mongoose.model('Content', contentSchema);
