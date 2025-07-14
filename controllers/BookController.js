const Book = require("../models/BookModel");
const User = require("../models/UserModel");

const getBook = async (req, res) => {
  try {
    const query = {};

    if (req.query.name) {
      query.name = { $regex: req.query.name, $options: "i" };
    }

    if (req.query.genre) {
      query.genre = { $in: req.query.genre.split(",") };
    }

    if (req.query.language) {
      query.language = { $regex: req.query.language, $options: "i" };
    }

    if (req.query.author) {
      query.author = { $in: req.query.author.split(",") };
    }

    const books = await Book.find(query);

    if (!books || books.length === 0) {
      return res.status(404).json({ message: "No se encontraron libros" });
    }

    res.status(200).json(books);
  } catch (error) {
    console.error("Error al obtener los libros:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

const getGenres = async (req, res) => {
  try {
    const genres = await Book.distinct("genre");
    res.json(genres.flat());
  } catch (error) {
    res.status(500).json({ message: "Error al obtener géneros" });
  }
};

const getAuthors = async (req, res) => {
  try {
    const authors = await Book.distinct("author");
    res.json(authors.flat());
  } catch (error) {
    res.status(500).json({ message: "Error al obtener autores" });
  }
};

const getLanguages = async (req, res) => {
  try {
    const languages = await Book.distinct("language");
    res.json(languages);
  } catch (error) {
    console.error("Error al obtener idiomas:", error);
    res.status(500).json({ message: "Error al obtener idiomas" });
  }
};

const getBookFilters = async (req, res) => {
  try {
    const [genres, languages, authors] = await Promise.all([
      Book.distinct("genre"),
      Book.distinct("language"),
      Book.distinct("author"),
    ]);

    res
      .status(200)
      .json({ genres: genres.flat(), languages, authors: authors.flat() });
  } catch (error) {
    console.error("Error al obtener filtros:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

const createBook = async (req, res) => {
  try {
    const { name } = req.body;

    const existingBook = await Book.findOne({ name });

    if (existingBook) {
      return res.status(409).json({ message: "El libro ya existe" });
    }
    const newBook = await Book.create(req.body);
    res.status(201).json(newBook);
  } catch (error) {
    console.error("Error al crear el libro:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

const getBookID = async (req, res) => {
  try {
    const id = req.params.id;
    const book = await Book.findById(id);
    res.json(book);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const addReview = async (req, res) => {
  try {
    const bookId = req.params.id;
    const { text, rating } = req.body;
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: "Libro no encontrado" });
    }
    const userId = req.user;
    book.review.push({ user: userId.id, text, rating });
    const updatedBook = await book.save();
    res.status(200).json({
      message: "Reseña añadida correctamente",
      book: updatedBook,
    });
  } catch (error) {
    console.error("Error al añadir la reseña:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

const likeBook = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findById(id);
    if (!book) return res.status(404).json({ message: "Libro no encontrado" });

    book.like += 1;
    await book.save();

    res.status(200).json({ message: "Like guardado", likes: book.like });
  } catch (error) {
    console.error("Error al dar like:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

const dislikeBook = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findById(id);
    if (!book) return res.status(404).json({ message: "Libro no encontrado" });

    book.dislike += 1;
    await book.save();

    res
      .status(200)
      .json({ message: "Dislike guardado", dislikes: book.dislike });
  } catch (error) {
    console.error("Error al dar dislike:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

const deleteReview = async (req, res) => {
  try {
    const bookId = req.params.id;
    const reviewId = req.query.reviewId;

    const resultado = await Book.updateOne(
      { _id: bookId },
      { $pull: { review: { _id: reviewId } } }
    );

    if (resultado.modifiedCount > 0) {
      res.status(200).json({ message: "Reseña eliminada correctamente" });
    } else {
      res.status(404).json({ message: "No se encontró la reseña o el libro" });
    }
  } catch (error) {
    console.error("Error al eliminar la reseña:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

const voteBook = async (req, res) => {
  try {
    const { id } = req.params;
    const { vote } = req.body;
    const userId = req.user.id;

    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({ message: "Libro no encontrado" });
    }

    const existingVote = book.votes.find((v) => v.user.toString() === userId);

    if (existingVote) {
      existingVote.vote = vote;
    } else {
      book.votes.push({ user: userId, vote });
    }

    const likeCount = book.votes.filter((v) => v.vote === "like").length;
    const dislikeCount = book.votes.filter((v) => v.vote === "dislike").length;

    book.like = likeCount;
    book.dislike = dislikeCount;

    await book.save();

    res.json({ like: likeCount, dislike: dislikeCount });
  } catch (error) {
    console.error("Error al votar:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

const saveBookToUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const bookId = req.params.id;


    const user = await User.findById(userId);
    if (!user)
      return res.status(404).json({ message: "Usuario no encontrado" });

    if (!user.savedBooks.includes(bookId)) {
      user.savedBooks.push(bookId);
      await user.save();
    }

    res.status(200).json({ message: "Libro guardado correctamente" });
  } catch (error) {
    console.error("Error al guardar el libro:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

const getSavedBooks = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).populate("savedBooks");

    if (!user)
      return res.status(404).json({ message: "Usuario no encontrado" });

    res.status(200).json(user.savedBooks);
  } catch (error) {
    console.error("Error al obtener libros guardados:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

module.exports = {
  getBook,
  createBook,
  getBookID,
  addReview,
  deleteReview,
  likeBook,
  dislikeBook,
  voteBook,
  getGenres,
  getAuthors,
  getLanguages,
  getBookFilters,
  saveBookToUser,
  getSavedBooks,
};
