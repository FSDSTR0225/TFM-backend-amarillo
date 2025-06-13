const Book = require("../models/BookModel");


/*
 * Obtener todas los libros
 * GET /books
 */

const getBook = async (req, res) => {
  try {
    const books = await Book.find(); // Obtén todos los libros

    if (!books || books.length === 0) {
      return res.status(404).json({ message: "No se encontraron libros" });
    }

    res.status(200).json(books);
  } catch (error) {
    console.error("Error al obtener el libro:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

/*
 * Crear un libro
 * Post /books
 */
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

/*

 * Obtener un libro específico por ID
 * GET /books/:id
 */
const getBookID = async (req, res) => {
  try {
    const id = req.params.id;
    const book = await Book.findById(id);
    res.json(book);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
/*
 * Añadir una reseña a un libro
 * PATCH /books/review/:id
 */
const addReview = async (req, res) => {
  try {
    const bookId = req.params.id;
    console.log("Datos de la reseña:", req.body);
    const { text, rating } = req.body;

    // Buscar el libro por ID
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: "Libro no encontrado" });
    }
    userId = req.user;

    console.log("ID del usuario:", userId.id);

    // // Verificar si el usuario ya ha dejado una reseña (opcional)
    // const existingReview = book.review.find(r => r.user.toString() === user);
    // if (existingReview) {
    //   return res.status(400).json({ message: "Ya has dejado una reseña para este libro" });
    // }

    // Añadir la reseña al array de reviews del libro
    book.review.push({ user: userId.id, text, rating });

    // Guardar el libro actualizado
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

/*
 * Dar like a un libro
 * POST /books/:id/like
 */
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

/*
 * Dar dislike a un libro
 * POST /books/:id/dislike
 */
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

/*
 * Eliminar una reseña a un libro
 * DELETE /books/review/:id?reviewId=id
 */
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

/*
 * FUNCIÓN DE VOTOS
 * POST  /books/:id/vote
 */
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

    // Actualizar contadores
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

module.exports = {
  getBook,
  createBook,
  getBookID,
  addReview,
  deleteReview,
  likeBook,
  dislikeBook,
  voteBook,
};
