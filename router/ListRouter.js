const express = require('express');
const router = express.Router();
const { getAuthUser } = require('../middlewares/auth');

const {
   //getUsers,
  } = require('../controllers/UserController');


  

//solo puede estrar si esta logueado
router.use(getAuthUser);

 /*

 Como tiene que estar estructurado de rutas

 // GET /usuarios - Obtener todos los usuarios
router.get('/', getUsers);
 
 */

//si necesitan usar body
router.use(express.json());



module.exports = router;