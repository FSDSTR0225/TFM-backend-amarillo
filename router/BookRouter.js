const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { getAuthUser } = require('../middlewares/auth');


const {
    getBook,
   createBook,
   getBookID,
   addReview
  } = require('../controllers/BookController');
const validationChecker = require('../middlewares/validationChecker');




 //si necesitan usar body
 router.use(express.json());

// POST /books - crear libros
router.post('/',[
   body('name').isString().withMessage('El nombre es obligatorio'),
   body('genre').isArray().withMessage('El genero es obligatorio'),
   body('language').isString().withMessage('El idioma es obligatorio y tiene que ser un array'),
   body('synopsis').isString().withMessage('la sinopsis es obligatorio'),
   body('author').isArray().withMessage('El autor es obligatorio  y tiene que ser un array'),
   body('imgBook').isURL().withMessage('la imagen es obligatorio y tiene que ser una url'),validationChecker
], createBook);

//solo puede estrar si esta logueado
router.use(getAuthUser);

// GET /books - Obtener todos los libros
 router.get('/', getBook);
 router.get('/:id', getBookID);
 router.get('/review/:id', addReview);



module.exports = router;