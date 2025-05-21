import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token no proporcionado" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id }; // 👈 Aquí añadimos el ID del usuario al request
    next();
  } catch (error) {
    console.error("Error verificando token:", error.message);
    return res.status(401).json({ message: "Token inválido" });
  }
};
