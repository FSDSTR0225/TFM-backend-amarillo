const { validationResult } = require("express-validator");

// middleware que lee los errores y los devuelve en la respuesta, si los hubiera
const validationChecker = (req, res, next) => {
  const result = validationResult(req);
  const errors = result.array();
  if (errors.length > 0) {
    return res.status(400).json(errors);
  }

  next();
};

module.exports = validationChecker;
