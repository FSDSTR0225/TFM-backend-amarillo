const express = require('express');
const router = express.Router();
const {
   //getUsers,
  } = require('../controllers/UserController');


  

//si necesitan usar body
router.use(express.json());

 /*

 Como tiene que estar estructurado de rutas

 // GET /usuarios - Obtener todos los usuarios
router.get('/', getUsers);
 
 */

//si necesitan usar body
router.use(express.json());



module.exports = router;