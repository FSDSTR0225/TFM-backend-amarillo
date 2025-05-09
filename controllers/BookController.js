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

module.exports = {
   getBook,
  createBook,
  };
  