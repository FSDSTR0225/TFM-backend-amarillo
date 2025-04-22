const User = require('../models/UserModel');


/*
 * login de un usuario
 * POST /users/login
*/

const loginUser = async (req, res) => {

  console.log(req.body);
  res.json({ msg: "Task updated" });
};

module.exports = {
   
    loginUser
  };
  