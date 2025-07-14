const User = require("../models/UserModel");
const Book = require("../models/BookModel");
const Room = require("../models/RoomModel");
const Message = require("../models/MessageModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cloudinary = require("../utils/cloudinary");
const streamifier = require("streamifier");
const nodemailer = require("nodemailer");
const  generateHtmlEmail  = require("../utilies/htmlemail");
let trasporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    auth: {
        user: "902898001@smtp-brevo.com",
        pass: process.env.PASS_EMAIL
    }
});


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

    //enviar email

    await trasporter.sendMail({
      from: "pablopianeloxd@gmail.com",
      to: email,
      subject: "Activación de cuenta",
      html: generateHtmlEmail(name),
    });

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
    profilePicture: user.profilePicture,
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
/*
 * Actualizar perfil de usuario
 * PUT /users/profile
 */
const updateUserProfile = async (req, res) => {
  try {
    console.log(" Usuario autenticado:", req.user);
    console.log(" Body recibido:", req.body);
    console.log("Archivo recibido:", req.file);
    const userId = req.user.id;

    const {
      name,
      profilePicture,
      currentPassword, // línea agregada para contraseña actual
      newPassword, // línea agregada para nueva contraseña
    } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      console.log(" Usuario no encontrado con ID:", userId);
      return res.status(404).json({ error: "Usuario no encontrado." });
    }
    if (req.file) {
      console.log("Subiendo imagen a Cloudinary...");

      // Convierte el archivo buffer en un stream y súbelo a Cloudinary
      const streamUpload = () => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "profile_pictures" }, // Puedes cambiar el folder
            (error, result) => {
              if (result) {
                resolve(result);
              } else {
                reject(error);
              }
            }
          );
          streamifier.createReadStream(req.file.buffer).pipe(stream);
        });
      };

      const result = await streamUpload();
      console.log("Imagen subida con éxito:", result.secure_url);

      const resizedUrl = result.secure_url.replace(
        "/upload/",
        "/upload/w_100,h_100,c_fill/"
      );

      user.profilePicture = result.secure_url; // Guarda la URL en la base de datos
    }


    // Manejo de cambio de contraseña (bloque agregado)
    if (newPassword) {
      if (!currentPassword) {
        console.log(" Falta contraseña actual");
        return res.status(400).json({ error: "Falta la contraseña actual." });
      }

      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        console.log(" Contraseña actual incorrecta");
        return res
          .status(401)
          .json({ error: "La contraseña actual es incorrecta." });
      }

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    if (name) user.name = name;
    if (profilePicture) user.profilePicture = profilePicture;


    await user.save();
    console.log(" Usuario actualizado con éxito");

    return res
      .status(200)
      .json({ message: "Perfil actualizado correctamente.", user });
  } catch (error) {
    console.error("Error actualizando perfil:", error);
    return res.status(500).json({ error: "Error interno del servidor." });
  }
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
};


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
    const { voteType } = req.body; // "like" o "dislike"

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    if (!book) {
      return res.status(404).json({ message: "Libro no encontrado" });
    }
    if (voteType === "like") {
      if (user.like.includes(book._id)) {
        return res.status(400).json({ message: "El libro ya está en like" });
      }
      // Si el voto es "like", añadimos las preferencias del usuario
      book.genre.forEach((genre) => {
        user.preferences.genres.push(genre);
      });
      book.author.forEach((author) => {
        user.preferences.authors.push(author);
      });
      user.preferences.languages.push(book.language);
      // Si el usuario ya tiene el libro en dislike, lo eliminamos de dislike y lo añadimos a like
      user.dislike.pull(book._id);
      user.like.push(book._id);
    } else {
      if (user.dislike.includes(book._id)) {
        return res.status(400).json({ message: "El libro ya está en dislike" });
      }
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
      // Si el usuario ya tiene el libro en like, lo eliminamos de like y lo añadimos a dislike
      user.like.pull(book._id);
      user.dislike.push(book._id);
    }
    await user.save();
    res.status(200).json({
      message: "Preferencias actualizadas correctamente",
      preferences: user.preferences,
    });
  } catch (error) {
    console.error("Error al insertar las preferencias del usuario:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

/**
 * ver lo like de un usuario
 * GET /users/like/:id
 */

const getLike = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).populate("like");
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    console.log(user.like);
    res.json(user.like);
  } catch (error) {
    console.error("Error al obtener las preferencias del usuario:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};


/**
 * Obtener preferencias de un usuario
 * DELETE /users/delete/:id
 */

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // Eliminar mensajes del usuario
    await Message.deleteMany({ userID: userId });

    // Sacar al usuario de las salas
    await Room.updateMany(
      { users: userId },
      { $pull: { users: userId } }
    );

    // ===== Eliminar votos en libros y ajustar contadores =====

    // Buscar todos los libros donde el usuario haya votado
    const books = await Book.find(
      { 'votes.user': userId },
      { votes: 1 }
    );

    // Recorrer cada libro para eliminar y ajustar
    for (const book of books) {
      const voteEntry = book.votes.find(v => v.user.toString() === userId);
      if (!voteEntry) continue;

      const isLike = voteEntry.vote === 'like';
      const isDislike = voteEntry.vote === 'dislike';

      await Book.findByIdAndUpdate(
        book._id,
        {
          $pull: { votes: { user: userId } },
          $inc: { like: isLike ? -1 : 0, dislike: isDislike ? -1 : 0 }
        }
      );
    }

    // ===== Eliminar reseñas del usuario =====
    await Book.updateMany(
      { 'review.user': userId },
      { $pull: { review: { user: userId } } }
    );

    // ===== Finalmente eliminar el usuario =====
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar el usuario:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};



module.exports = {
  loginUser,
  register,
  getUserID,
  getAllUsers,
  getPreferences,
  insetPreferences,
  getLike,
  updateUserProfile,
  deleteUser,
};
