const User = require("../models/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cloudinary = require("../utils/cloudinary");
const streamifier = require("streamifier");
const nodemailer = require("nodemailer");
const  generateHtmlEmail  = require("../utils/htmlemail");

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
      from: process.env.EMAIL_HOST,
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
      genres,
      languages,
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

      // const resizedUrl = result.secure_url.replace(
      //   "/upload/",
      //   "/upload/w_100,h_100,c_fill/"
      // );

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

    if (genres || languages) {
      if (!Array.isArray(user.preferences) || user.preferences.length === 0) {
        user.preferences = [{}];
      }

      try {
        const parsedGenres =
          typeof genres === "string" ? JSON.parse(genres) : genres;
        const parsedLanguages =
          typeof languages === "string" ? JSON.parse(languages) : languages;

        if (parsedGenres) user.preferences[0].genres = parsedGenres;
        if (parsedLanguages) user.preferences[0].languages = parsedLanguages;
      } catch (err) {
        console.error("Error parseando géneros o idiomas:", err);
        return res
          .status(400)
          .json({ error: "Formato inválido para géneros o idiomas." });
      }
    }

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

module.exports = {
  loginUser,
  register,
  getUserID,
  updateUserProfile,
  getAllUsers,
};
