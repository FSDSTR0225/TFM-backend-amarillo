const User = require("../models/UserModel");
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
    process.env.JWT_SECRET
    // { expiresIn: '3m' } // Cambia el tiempo de expiración
  );
  const userData = {
    id: user._id,
    name: user.name,
    email: user.email,
  };
  res.json({
    msg: "Task updated",
    access_token: token,
    token_type: "Bearer",
    user: userData,
  });
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

// Este endpoint permite a un usuario guardar un libro en su lista de libros guardados
const saveBookForUser = async (req, res) => {
  const userId = req.user.id;
  const bookId = req.params.bookId;

  try {
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: "El libro no existe." });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "El libro no existe." });
    }

    if (user.saved.includes(bookId)) {
      return res.status(403).json({ message: "Ya guardaste este libro." });
    }

    user.saved.push(bookId);
    await user.save();

    return res.status(200).json({ message: "Libro guardado correctamente." });
  } catch (error) {
    console.error("Error al guardar el libro:", error);
    return res.status(500).json({ message: "Error del servidor." });
  }
};

module.exports = {
  loginUser,
  register,
  getUserID,
  saveBookForUser,
};
