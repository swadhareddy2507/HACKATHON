const Reservation = require('../models/Reservation');
const Book = require('../models/Book');
const Transaction = require('../models/Transaction');

// @desc    Create reservation
// @route   POST /api/reservations
// @access  Private (Student)
exports.createReservation = async (req, res) => {
  try {
    const { bookId } = req.body;
    const userId = req.user.id;

    // Check if book exists
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    // Check if book is available
    if (book.copiesAvailable === 0) {
      return res.status(400).json({
        success: false,
        message: 'Book is not available'
      });
    }

    // Check if user already has a pending reservation for this book
    const existingReservation = await Reservation.findOne({
      userId,
      bookId,
      status: { $in: ['Pending', 'Approved'] }
    });

    if (existingReservation) {
      return res.status(400).json({
        success: false,
        message: 'You already have a pending or approved reservation for this book'
      });
    }

    // Create reservation
    const reservation = await Reservation.create({
      userId,
      bookId,
      status: 'Pending'
    });

    // Populate book details
    await reservation.populate('bookId', 'title author category');

    res.status(201).json({
      success: true,
      message: 'Reservation created successfully',
      data: reservation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating reservation'
    });
  }
};

// @desc    Get user's reservations
// @route   GET /api/reservations/my
// @access  Private
exports.getMyReservations = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status } = req.query;

    let query = { userId };
    if (status) {
      query.status = status;
    }

    const reservations = await Reservation.find(query)
      .populate('bookId', 'title author category copiesAvailable')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reservations.length,
      data: reservations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching reservations'
    });
  }
};

// @desc    Get single reservation
// @route   GET /api/reservations/:id
// @access  Private
exports.getReservationById = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id)
      .populate('userId', 'name email')
      .populate('bookId', 'title author category');

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Reservation not found'
      });
    }

    // Check if user owns reservation or is librarian
    if (reservation.userId._id.toString() !== req.user.id && req.user.role !== 'Librarian') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this reservation'
      });
    }

    res.status(200).json({
      success: true,
      data: reservation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching reservation'
    });
  }
};

// @desc    Update reservation status
// @route   PUT /api/reservations/:id/status
// @access  Private (Librarian)
exports.updateReservationStatus = async (req, res) => {
  try {
    const { status, rejectionReason } = req.body;
    const reservation = await Reservation.findById(req.params.id)
      .populate('bookId');

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Reservation not found'
      });
    }

    const book = await Book.findById(reservation.bookId._id);

    // Handle status updates
    if (status === 'Approved') {
      if (book.copiesAvailable === 0) {
        return res.status(400).json({
          success: false,
          message: 'Book is not available'
        });
      }
      reservation.status = 'Approved';
      reservation.approvalDate = new Date();
      book.copiesAvailable -= 1;
      await book.save();
    } else if (status === 'Rejected') {
      reservation.status = 'Rejected';
      if (rejectionReason) {
        reservation.rejectionReason = rejectionReason;
      }
    } else if (status === 'Issued') {
      if (reservation.status !== 'Approved') {
        return res.status(400).json({
          success: false,
          message: 'Reservation must be approved before issuing'
        });
      }
      reservation.status = 'Issued';
      
      // Create transaction
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 7); // 7 days from now

      await Transaction.create({
        reservationId: reservation._id,
        userId: reservation.userId,
        bookId: reservation.bookId._id,
        issueDate: new Date(),
        dueDate
      });
    } else if (status === 'Returned') {
      if (reservation.status !== 'Issued') {
        return res.status(400).json({
          success: false,
          message: 'Only issued books can be returned'
        });
      }
      reservation.status = 'Returned';
      
      // Update transaction
      const transaction = await Transaction.findOne({ reservationId: reservation._id });
      if (transaction) {
        transaction.returnDate = new Date();
        transaction.isReturned = true;
        transaction.calculateFine();
        await transaction.save();
      }

      // Increase available copies
      book.copiesAvailable += 1;
      await book.save();
    } else if (status === 'Cancelled') {
      if (reservation.status === 'Issued') {
        return res.status(400).json({
          success: false,
          message: 'Cannot cancel an issued book. Please return it first.'
        });
      }
      
      // If approved, increase available copies
      if (reservation.status === 'Approved') {
        book.copiesAvailable += 1;
        await book.save();
      }
      
      reservation.status = 'Cancelled';
    }

    await reservation.save();

    res.status(200).json({
      success: true,
      message: `Reservation ${status.toLowerCase()} successfully`,
      data: reservation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating reservation'
    });
  }
};

// @desc    Cancel reservation (Student)
// @route   PUT /api/reservations/:id/cancel
// @access  Private (Student)
exports.cancelReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id)
      .populate('bookId');

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Reservation not found'
      });
    }

    // Check if user owns reservation
    if (reservation.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this reservation'
      });
    }

    // Check if can be cancelled
    if (reservation.status === 'Issued') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel an issued book. Please return it first.'
      });
    }

    if (reservation.status === 'Returned' || reservation.status === 'Cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Reservation is already cancelled or returned'
      });
    }

    const book = await Book.findById(reservation.bookId._id);

    // If approved, increase available copies
    if (reservation.status === 'Approved') {
      book.copiesAvailable += 1;
      await book.save();
    }

    reservation.status = 'Cancelled';
    await reservation.save();

    res.status(200).json({
      success: true,
      message: 'Reservation cancelled successfully',
      data: reservation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error cancelling reservation'
    });
  }
};

// @desc    Get all reservations (Librarian)
// @route   GET /api/reservations
// @access  Private (Librarian)
exports.getAllReservations = async (req, res) => {
  try {
    const { status } = req.query;
    let query = {};

    if (status) {
      query.status = status;
    }

    const reservations = await Reservation.find(query)
      .populate('userId', 'name email')
      .populate('bookId', 'title author category')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reservations.length,
      data: reservations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching reservations'
    });
  }
};

