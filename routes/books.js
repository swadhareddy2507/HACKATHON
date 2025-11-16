const express = require('express');
const router = express.Router();
const {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook
} = require('../controllers/bookController');
const { protect, authorize } = require('../middleware/auth');
const { validate, bookValidation } = require('../middleware/validation');

router.get('/', getAllBooks);
router.get('/:id', getBookById);
router.post('/', protect, authorize('Librarian'), validate(bookValidation), createBook);
router.put('/:id', protect, authorize('Librarian'), updateBook);
router.delete('/:id', protect, authorize('Librarian'), deleteBook);

module.exports = router;

