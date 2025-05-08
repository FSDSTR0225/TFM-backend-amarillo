const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

const {
    // getUser,
    loginUser,
  } = require('../controllers/UserController');
const validationChecker = require('../middlewares/validationChecker');
const { getAuthUser } = require('../middlewares/auth');



//si necesitan usar body
router.use(express.json());


// POST /users/login - login de un usuario
router.post('/login',
    [
    body('email')
    .isEmail()
    .withMessage('Email no válido'),
    body('password')
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres')
    .matches(/[0-9]/)
    .withMessage('La contraseña debe contener al menos un número')
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage('La contraseña debe contener al menos un carácter especial'),validationChecker
]
    ,loginUser )
//solo puede estrar si esta logueado
router.use(getAuthUser);

//prueba
// router.get('/me',getUser);


module.exports = router;