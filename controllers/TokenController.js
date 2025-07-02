const jwt = require("jsonwebtoken");
/*
* Obtener todas las tareas
* POST /token/validate
*/
const validateToken = async (req, res) => {
  
  res.status(200).json({
    message: 'Token is valid',
    user: req.authUser, // aquí vienen los datos del usuario desde el token
  });
}
module.exports = {
  validateToken,
    
  };
  