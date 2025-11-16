const express = require('express');
const router = express.Router();
const {
  createReservation,
  getMyReservations,
  getReservationById,
  updateReservationStatus,
  cancelReservation,
  getAllReservations
} = require('../controllers/reservationController');
const { protect, authorize } = require('../middleware/auth');
const { validate, reservationValidation } = require('../middleware/validation');

// Student routes
router.post('/', protect, authorize('Student'), validate(reservationValidation), createReservation);
router.get('/my', protect, getMyReservations);
router.put('/:id/cancel', protect, authorize('Student'), cancelReservation);

// Librarian routes
router.get('/', protect, authorize('Librarian'), getAllReservations);
router.get('/:id', protect, getReservationById);
router.put('/:id/status', protect, authorize('Librarian'), updateReservationStatus);

module.exports = router;

