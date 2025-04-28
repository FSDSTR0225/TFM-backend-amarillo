const express = require('express');
const router = express.Router();
const { body } = require('express-validator');


const {
    getBook,
   createBook,
  } = require('../controllers/BookController');
const validationChecker = require('../middlewares/validationChecker');





// GET /books - Obtener todos los libros
 router.get('/', getBook);

// POST /books - crear libros
router.post('/',[
   body('name').isString().withMessage('El nombre es obligatorio'),
   body('genre').isString().withMessage('El genero es obligatorio'),
   body('language').isArray().withMessage('El idioma es obligatorio y tiene que ser un array'),
   body('synopsis').isString().withMessage('la sinopsis es obligatorio'),
   body('author').isArray().withMessage('El autor es obligatorio  y tiene que ser un array'),
   body('imgBook').isURL().withMessage('la imagen es obligatorio y tiene que ser una url'),validationChecker
], createBook);



module.exports = router;