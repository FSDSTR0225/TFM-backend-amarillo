const User = require('../models/UserModel');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


/*
 * login de un usuario
 * POST /users/login
*/

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email });


  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const token = jwt.sign(
    {
      id: user._id,
      name: user.name,
      email: user.email,
    },
    process.env.JWT_SECRET,
   // { expiresIn: '3m' } // Cambia el tiempo de expiración 
  );
  const userData = {
    id: user._id,
    name: user.name,
    email: user.email,
  };
  res.json({msg: "Task updated", access_token: token, token_type: "Bearer" ,user:userData });
};

//prueba
// const getUser = (req, res, next) => {
//   const user = req.authUser;
//   if (!user) {
//     return res.status(401).json({ message: "No user found" });
//   }
//   res.json(user);

// };
/*
 * sarcar un usuario por id
 * GET /users/:id
*/
const getUserID = async (req, res) => {

  const userId = req.params.id;

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.json(user);
};



module.exports = {
  // getUser,
    loginUser,
    getUserID
  };
  