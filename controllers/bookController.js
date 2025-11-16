const Book = require('../models/Book');

// @desc    Get all books
// @route   GET /api/books
// @access  Public
exports.getAllBooks = async (req, res) => {
  try {
    const { search, category, author } = req.query;
    let query = {};

    // Search by title, author, or category
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
    }

    if (category) {
      query.category = { $regex: category, $options: 'i' };
    }

    if (author) {
      query.author = { $regex: author, $options: 'i' };
    }

    const books = await Book.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: books.length,
      data: books
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching books'
    });
  }
};

// @desc    Get single book
// @route   GET /api/books/:id
// @access  Public
exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    res.status(200).json({
      success: true,
      data: book
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching book'
    });
  }
};

// @desc    Create book
// @route   POST /api/books
// @access  Private (Librarian only)
exports.createBook = async (req, res) => {
  try {
    const { title, author, category, copiesTotal, description } = req.body;

    const book = await Book.create({
      title,
      author,
      category,
      copiesTotal,
      copiesAvailable: copiesTotal,
      description
    });

    res.status(201).json({
      success: true,
      message: 'Book created successfully',
      data: book
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating book'
    });
  }
};

// @desc    Update book
// @route   PUT /api/books/:id
// @access  Private (Librarian only)
exports.updateBook = async (req, res) => {
  try {
    let book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    const { title, author, category, copiesTotal, description } = req.body;

    // If copiesTotal is updated, adjust copiesAvailable
    if (copiesTotal !== undefined) {
      const difference = copiesTotal - book.copiesTotal;
      book.copiesAvailable = Math.max(0, book.copiesAvailable + difference);
      book.copiesTotal = copiesTotal;
    }

    if (title) book.title = title;
    if (author) book.author = author;
    if (category) book.category = category;
    if (description !== undefined) book.description = description;

    await book.save();

    res.status(200).json({
      success: true,
      message: 'Book updated successfully',
      data: book
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating book'
    });
  }
};

// @desc    Delete book
// @route   DELETE /api/books/:id
// @access  Private (Librarian only)
exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    await book.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Book deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error deleting book'
    });
  }
};

