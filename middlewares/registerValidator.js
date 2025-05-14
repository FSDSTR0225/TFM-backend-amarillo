const { body } = require("express-validator");

const registerValidator = [
  body("name").notEmpty().withMessage("El nombre es obligatorio"),

  body("email").isEmail().withMessage("El correo no tiene un formato válido"),

  body("password")
    .isLength({ min: 8 })
    .withMessage("La contraseña debe tener al menos 8 caracteres")
    .matches(/[a-z]/)
    .withMessage("La contraseña debe tener al menos una letra minúscula")
    .matches(/[A-Z]/)
    .withMessage("La contraseña debe tener al menos una letra mayúscula")
    .matches(/[0-9]/)
    .withMessage("La contraseña debe tener al menos un número"),
];

module.exports = registerValidator;
