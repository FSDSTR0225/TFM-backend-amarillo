const User = require("../models/UserModel");
const bcrypt = require("bcrypt");

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

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
como tiene que ser la estructura de los controladores

 * Obtener todas las tareas
 * GET /Users
 
const getUsers = async (req, res) => {
    try {
      const Users = await Task.find({}).populate('owner', 'name');
      res.json(Users);
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  };
  
*/

module.exports = {
  register,
};
