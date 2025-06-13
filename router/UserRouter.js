const express = require("express");
const router = express.Router();
const { body, check } = require("express-validator");
const upload = require("../middlewares/uploadMiddleware");

const {
  loginUser,
  getUserID,
  register,
  updateUserProfile,
  getAllUsers,
} = require("../controllers/UserController");
const validationChecker = require("../middlewares/validationChecker");
const { getAuthUser } = require("../middlewares/auth");


//si necesitan usar body
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

// POST /users/register - registro de un usuario
router.post(
  "/register",
  [
    // Validaciones de campos
    check("name", "El nombre es obligatorio").not().isEmpty(),
    check("email", "El correo debe ser válido").isEmail(),
    check(
      "password",
      "La contraseña debe tener al menos 6 caracteres, una mayúscula, una minúscula , un número y una caracter especial"
    )
      .isLength({ min: 6 })
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/)
      .matches(/[!@#$%^&*(),.?":{}|<>]/)
      .matches(/[0-9]/),
  ],
  validationChecker, // Middleware que devuelve errores si los hay
  register // Controlador encargado de registrar al usuario
);

// POST /users/login - login de un usuario
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Email no válido"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("La contraseña debe tener al menos 6 caracteres")
      .matches(/[0-9]/)
      .withMessage("La contraseña debe contener al menos un número")
      .matches(/[!@#$%^&*(),.?":{}|<>]/)
      .withMessage("La contraseña debe contener al menos un carácter especial")
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/)
      .withMessage(
        "La contraseña debe contener al menos una mayúscula, una minúscula"
      ),
    validationChecker,
  ],
  loginUser
);
//solo puede estrar si esta logueado
router.use(getAuthUser);

// GET /users
router.get("/all", getAllUsers);

//GET /users/:id
router.get("/:id", getUserID);

// PUT /users/profile - actualizar perfil de usuario
router.put(
  "/profile",
  upload.single("photo"), // Middleware de multer para 1 archivo con campo 'photo'
  updateUserProfile
);

module.exports = router;
