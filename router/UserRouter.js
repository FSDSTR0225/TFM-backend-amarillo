const express = require("express");
const router = express.Router();
const { body } = require('express-validator');

const {

  //getUsers,
  register,
} = require("../controllers/UserController");
const { check } = require("express-validator");
const validationChecker = require("../middlewares/validationChecker");
//si necesitan usar body
router.use(express.json());
/*

    // getUser,
    loginUser,
  } = require('../controllers/UserController');
const validationChecker = require('../middlewares/validationChecker');
const { getAuthUser } = require('../middlewares/auth');



//si necesitan usar body
router.use(express.json());



 // GET /usuarios - Obtener todos los usuarios
router.get('/', getUsers);
 
 */
router.post(
  "/register",
  [
    // Validaciones de campos
    check("name", "El nombre es obligatorio").not().isEmpty(),
    check("email", "El correo debe ser válido").isEmail(),
    check(
      "password",
      "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número"
    )
      .isLength({ min: 8 })
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/),
  ],
  validationChecker, // Middleware que devuelve errores si los hay
  register // Controlador encargado de registrar al usuario
);

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
