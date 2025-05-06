const User = require('../models/UserModel');
const jwt = require("jsonwebtoken");


/*
 * login de un usuario
 * POST /users/login
*/

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email });


  if (!user && user.password !== password) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  // if (!user && bcrypt.compareSync(password, user.password)) {
  //   return res.status(401).json({ message: "Invalid email or password" });
  // }

  const token = jwt.sign(
    {
      id: user._id,
      name: user.name,
      email: user.email,
    },
    process.env.JWT_SECRET
  );

  res.json({ access_token: token, token_type: "Bearer" });
  res.json({ msg: "Task updated" });
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
  // getUser,
    loginUser
  };
  