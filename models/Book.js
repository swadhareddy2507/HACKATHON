const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a book title'],
    trim: true
  },
  author: {
    type: String,
    required: [true, 'Please provide an author name'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Please provide a category'],
    trim: true
  },
  copiesTotal: {
    type: Number,
    required: [true, 'Please provide total copies'],
    min: [1, 'Total copies must be at least 1']
  },
  copiesAvailable: {
    type: Number,
    required: true,
    min: [0, 'Available copies cannot be negative']
  },
  status: {
    type: String,
    enum: ['Available', 'Reserved', 'Issued'],
    default: 'Available'
  },
  description: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Update status based on copiesAvailable
bookSchema.pre('save', function(next) {
  if (this.copiesAvailable === 0) {
    this.status = 'Issued';
  } else if (this.copiesAvailable < this.copiesTotal) {
    this.status = 'Reserved';
  } else {
    this.status = 'Available';
  }
  next();
});

module.exports = mongoose.model('Book', bookSchema);

