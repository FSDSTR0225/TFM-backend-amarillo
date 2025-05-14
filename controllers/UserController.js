
const User = require("../models/UserModel");
const bcrypt = require("bcrypt");

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

const User = require('../models/UserModel');
const jwt = require("jsonwebtoken");

    if (!name || !email || !password) {
      return res.status(400).json({
        status: 400,
        msg: "Faltan datos o no lo has rellenado correctamente",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(403).json({
        status: 403,
        msg: "El correo/nombre que estás poniendo, ya existe en el sistema",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({
      msg: "Usuario registrado correctamente. Verifica tu correo para activar la cuenta.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error del servidor" });
  }
};
/*
 * login de un usuario
 * POST /users/login
*/

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email });



  if (!user || user.password !== password) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  // if (!user || bcrypt.compareSync(password, user.password)) {
  //   return res.status(401).json({ message: "Invalid email or password" });
  // }

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

module.exports = {
  register,
};

  // getUser,
    loginUser
  };

