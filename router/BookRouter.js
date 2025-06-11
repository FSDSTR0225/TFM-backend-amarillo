const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const { getAuthUser } = require("../middlewares/auth");

const { getBook, createBook, getBookID, addReview, deleteReview } = require("../controllers/BookController");
const validationChecker = require("../middlewares/validationChecker");


//si necesitan usar body
router.use(express.json());

// POST /books - crear libros

router.post(
  "/",
  [body("name").isString().withMessage("El nombre es obligatorio"), body("genre").isArray().withMessage("El genero es obligatorio"), body("language").isString().withMessage("El idioma es obligatorio y tiene que ser un array"), body("synopsis").isString().withMessage("la sinopsis es obligatorio"), body("author").isArray().withMessage("El autor es obligatorio  y tiene que ser un array"), body("imgBook").isURL().withMessage("la imagen es obligatorio y tiene que ser una url"), validationChecker],
  createBook
);

//solo puede estrar si esta logueado
router.use(getAuthUser);

// GET /books - Obtener todos los libros
router.get("/", getBook);

// GET /books/:id - Obtener un libro por ID
router.get("/:id", getBookID);
// PATCH /books/review/:id - Agregar una reseña a un libro
router.patch("/review/:id", [body("text").isString().withMessage("El nombre es obligatorio").isLength({ min: 10 }).withMessage("El text debe tener al menos 10 caracteres"), body("rating").isNumeric().withMessage("El rating es obligatorio").matches(/[0-5]/).withMessage("rating debe ser un número entre 0 y 5"), validationChecker], addReview);

// DELETE /books/:id?reviewId=id - Eliminar un libro por ID
router.delete("/review/:id", deleteReview);

// POST /books/:id/like - Dar like a un libro
router.post("/:id/like", likeBook);

// POST /books/:id/dislike - Dar dislike a un libro
router.post("/:id/dislike", dislikeBook);


// POST /books/:id/vote
router.post("/:id/vote", voteBook);

module.exports = router;
