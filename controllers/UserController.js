
const User = require('../models/UserModel');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Book = require("../models/BookModel");

/*
* registro de un usuario
* POST /users/register 
*/
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


/**
 * sacrar todos los usarios
 * GET /users
 */
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error("Error al obtener los usuarios:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
}

/**
 * obtener preferencias de un usuario
 * GET /users/preferences/:id
 */
const getPreferences = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user.preferences);
  } catch (error) {
    console.error("Error al obtener las preferencias del usuario:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

/**
 * Insertar o eliminar preferencias de un usuario
 * POST /users/preferences/:idBook
 */
const insetPreferences = async (req, res) => {
  try {
     const userId = req.user.id;
    const user = await User.findById(userId);
    const bookid = req.params.idBook;
    const book = await Book.findById(bookid);
    const {voteType} = req.body; // "like" o "dislike"

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
      if (!book) {
      return res.status(404).json({ message: "Libro no encontrado" });
    }
    if (voteType === "like") {
      // Si el voto es "like", añadimos las preferencias del usuario
      book.genre.forEach((genre) => {
        user.preferences.genres.push(genre);
      });
      book.author.forEach((author) => {
        user.preferences.authors.push(author);
      });

      user.preferences.languages.push(book.language);
    } else {
      // Si el voto es "dislike", eliminamos las preferencias del usuario
      book.genre.forEach((genre) => {
        const index = user.preferences.genres.indexOf(genre);
        if (index > -1) {
          user.preferences.genres.splice(index, 1);
        }
      });
      book.author.forEach((author) => {
        const index = user.preferences.authors.indexOf(author);
        if (index > -1) {
          user.preferences.authors.splice(index, 1);
        }
      });

      const languageIndex = user.preferences.languages.indexOf(book.language);
      if (languageIndex > -1) {
        user.preferences.languages.splice(languageIndex, 1);
      }
    }
    await user.save();
    res.status(200).json({
      message: "Preferencias actualizadas correctamente",
      preferences: user.preferences,
    });
  }catch (error) {
    console.error("Error al insertar las preferencias del usuario:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
   
};

module.exports = {
    loginUser,
    register,
    getUserID,
    getAllUsers,
    getPreferences,
    insetPreferences
  };
  




