const Reservation = require('../models/Reservation');
const Transaction = require('../models/Transaction');
const Book = require('../models/Book');

// @desc    Get dashboard stats
// @route   GET /api/reports/dashboard
// @access  Private (Librarian)
exports.getDashboard = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Books reserved today
    const reservedToday = await Reservation.countDocuments({
      reservationDate: { $gte: today, $lt: tomorrow },
      status: { $in: ['Pending', 'Approved'] }
    });

    // Total books
    const totalBooks = await Book.countDocuments();
    const availableBooks = await Book.countDocuments({ copiesAvailable: { $gt: 0 } });

    // Active issues
    const activeIssues = await Transaction.countDocuments({ isReturned: false });

    // Overdue returns
    const overdueReturns = await Transaction.countDocuments({
      isReturned: false,
      dueDate: { $lt: new Date() }
    });

    // Pending reservations
    const pendingReservations = await Reservation.countDocuments({ status: 'Pending' });

    // Total transactions
    const totalTransactions = await Transaction.countDocuments();

    res.status(200).json({
      success: true,
      data: {
        reservedToday,
        totalBooks,
        availableBooks,
        activeIssues,
        overdueReturns,
        pendingReservations,
        totalTransactions
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching dashboard data'
    });
  }
};

// @desc    Get books reserved today
// @route   GET /api/reports/reserved-today
// @access  Private (Librarian)
exports.getReservedToday = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const reservations = await Reservation.find({
      reservationDate: { $gte: today, $lt: tomorrow },
      status: { $in: ['Pending', 'Approved'] }
    })
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
      message: error.message || 'Error fetching reserved books'
    });
  }
};

// @desc    Get issued books
// @route   GET /api/reports/issued
// @access  Private (Librarian)
exports.getIssuedBooks = async (req, res) => {
  try {
    const transactions = await Transaction.find({ isReturned: false })
      .populate('userId', 'name email')
      .populate('bookId', 'title author category')
      .sort({ issueDate: -1 });

    res.status(200).json({
      success: true,
      count: transactions.length,
      data: transactions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching issued books'
    });
  }
};

// @desc    Get overdue returns
// @route   GET /api/reports/overdue
// @access  Private (Librarian)
exports.getOverdueReturns = async (req, res) => {
  try {
    const transactions = await Transaction.find({
      isReturned: false,
      dueDate: { $lt: new Date() }
    })
      .populate('userId', 'name email')
      .populate('bookId', 'title author category')
      .sort({ dueDate: 1 });

    // Calculate fine for each
    const transactionsWithFine = transactions.map(transaction => {
      const lateDays = Math.ceil((new Date() - transaction.dueDate) / (1000 * 60 * 60 * 24));
      return {
        ...transaction.toObject(),
        lateDays,
        calculatedFine: lateDays * 10
      };
    });

    res.status(200).json({
      success: true,
      count: transactionsWithFine.length,
      data: transactionsWithFine
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching overdue returns'
    });
  }
};

// @desc    Get active issues
// @route   GET /api/reports/active
// @access  Private (Librarian)
exports.getActiveIssues = async (req, res) => {
  try {
    const transactions = await Transaction.find({ isReturned: false })
      .populate('userId', 'name email')
      .populate('bookId', 'title author category')
      .sort({ issueDate: -1 });

    res.status(200).json({
      success: true,
      count: transactions.length,
      data: transactions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching active issues'
    });
  }
};

