const fetch = require("node-fetch"); // importar la libreria
const mongoose = require("mongoose"); // importar mongoose
const Book = require("../models/BookModel"); // importar el modelo de libro
require("dotenv").config(); // importar dotenv para las variables de entorno

// Conectar a MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.log("MongoDB connection error: ", err));
// generos de libros
genres = ["Mystery", "Fantasy", "Horror", "Romance"];
async function fetchAndSaveBooks() {
  for (let i = 0; i < genres.length; i++) {
    console.log(`Fetching books for genre: ${genres[i]}`);
    const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=subject:${genres[i]}&maxResults=5`);

    if (!res.ok) {
      throw new Error("Error while requesting tasks");
    }

    const data = await res.json();

    // Verificar que existen elementos en "data.items"
    if (data.items && data.items.length > 0) {
      // Iterar sobre todos los elementos de data.items
      for (const item of data.items) {
        const title = item.volumeInfo?.title || "No title available";
        const authors = item.volumeInfo?.authors || "No authors available";
        const categories = item.volumeInfo?.categories || "No description available";
        const description = item.volumeInfo?.description || "No description available";
        const img = item.volumeInfo?.imageLinks?.extraLarge || item.volumeInfo?.imageLinks?.large || item.volumeInfo?.imageLinks?.medium || item.volumeInfo?.imageLinks?.thumbnail || item.volumeInfo?.imageLinks?.smallThumbnail || "https://media1.tenor.com/m/sSYnkkUnFyIAAAAC/error-fail.gif";

        const language = item.volumeInfo?.language || "No language available";

        // Crear un nuevo documento de libro para guardar en MongoDB
        const newBook = new Book({
          name: title,
          genre: categories,
          language: language,
          imgBook: img,
          synopsis: description,
          author: authors,
        });

        // Comprobar si el libro ya existe en la base de datos
        const existingBook = await Book.findOne({ name: title }); // Buscamos el libro por su título
        if (existingBook) {
          console.log(`The book "${title}" already exists in the database.`);
          continue; // Si el libro ya existe, no lo guardamos, pasamos al siguiente libro
        }

        // Guardar el libro en la base de datos
        try {
          await newBook.save(); // Guardar en MongoDB
          console.log(`Book "${title}" saved successfully`);
        } catch (error) {
          console.log(`Error saving book "${title}":`, error);
        }
      }
    } else {
      console.log("No books found in the response.");
    }
  }
}

// Ejecutar la función
fetchAndSaveBooks();
