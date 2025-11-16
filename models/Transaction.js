const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  reservationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Reservation',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  issueDate: {
    type: Date,
    default: Date.now
  },
  dueDate: {
    type: Date,
    required: true
  },
  returnDate: {
    type: Date
  },
  fineAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  isReturned: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Calculate fine when return date is set
transactionSchema.methods.calculateFine = function() {
  if (this.returnDate && this.returnDate > this.dueDate) {
    const lateDays = Math.ceil((this.returnDate - this.dueDate) / (1000 * 60 * 60 * 24));
    this.fineAmount = lateDays * 10;
  }
  return this.fineAmount;
};

module.exports = mongoose.model('Transaction', transactionSchema);

