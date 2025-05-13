const Book = require('../models/BookModel');





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
    const existingBook = await Book.findOne({ where: { name } });

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
    const { name, text, rating } = req.body;

    console.log("Datos de la reseña:", req.body);
    // Buscar el libro por ID
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: "Libro no encontrado" });
    }

    // // Verificar si el usuario ya ha dejado una reseña (opcional)
    // const existingReview = book.review.find(r => r.user.toString() === user);
    // if (existingReview) {
    //   return res.status(400).json({ message: "Ya has dejado una reseña para este libro" });
    // }

    // Añadir la reseña al array de reviews del libro
    book.review.push({ name, text, rating });
    
    // Guardar el libro actualizado
    const updatedBook = await book.save();

    res.status(200).json({ 
      message: "Reseña añadida correctamente", 
      book: updatedBook 
    });
  } catch (error) {
    console.error("Error al añadir la reseña:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

module.exports = {
   getBook,
  createBook,
  getBookID,
  addReview
  };
  