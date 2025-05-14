const jwt = require("jsonwebtoken");

const getAuthUser = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }
  if (!token.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Invalid token format" });
  }
  const tokenWithoutBearer = token.split(" ")[1];
  // Verify the token
  try {
    const authUser = jwt.verify(tokenWithoutBearer, process.env.JWT_SECRET);
    req.authUser = authUser;
    next();
  } catch (e) {
    return res.status(401).json({ message: `No autorizado ${e}` });
  }
};

module.exports = { getAuthUser };