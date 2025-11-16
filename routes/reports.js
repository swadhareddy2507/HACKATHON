const express = require('express');
const router = express.Router();
const {
  getDashboard,
  getReservedToday,
  getIssuedBooks,
  getOverdueReturns,
  getActiveIssues
} = require('../controllers/reportController');
const { protect, authorize } = require('../middleware/auth');

router.get('/dashboard', protect, authorize('Librarian'), getDashboard);
router.get('/reserved-today', protect, authorize('Librarian'), getReservedToday);
router.get('/issued', protect, authorize('Librarian'), getIssuedBooks);
router.get('/overdue', protect, authorize('Librarian'), getOverdueReturns);
router.get('/active', protect, authorize('Librarian'), getActiveIssues);

module.exports = router;

