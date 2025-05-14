const express = require('express');
const router = express.Router();
const {
    validateToken,
  } = require('../controllers/TokenController');
const { getAuthUser } = require('../middlewares/auth');


//si necesitan usar body


//POST /token/validate - Validar el token de un usuario
router.use(getAuthUser);
router.post('/validate',validateToken);





module.exports = router;