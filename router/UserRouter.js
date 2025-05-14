const express = require("express");
const router = express.Router();
const {
  //getUsers,
  register,
} = require("../controllers/UserController");
const { check } = require("express-validator");
const validationChecker = require("../middlewares/validationChecker");
//si necesitan usar body
router.use(express.json());
/*

 Como tiene que estar estructurado de rutas

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

module.exports = router;
