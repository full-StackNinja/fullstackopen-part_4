const loginRouter = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../utils/config");
loginRouter.post("/", async (req, res) => {
   const { username, password } = req.body;
   // console.log("🚀 ~ loginRouter.post ~ username:", username)
   // console.log("🚀 ~ loginRouter.post ~ password:", password)
   const user = await User.findOne({ username })
   // console.log("🚀 ~ loginRouter.post ~ user:", user)
   
   const passwordCorrect =
      user === null ? false : await bcrypt.compare(password, user.password);
      // console.log("🚀 ~ loginRouter.post ~ passwordCorrect:", passwordCorrect)
   if (!(user && passwordCorrect))
      return res.status(401).json({ error: "incorrect username or password" });
   const userForToken = {
      name: user.name,
      username,
   };
   const token = jwt.sign(userForToken, config.SECRET);
   res.status(200).json({
      token,
      name: user.name,
      username,
   });
});

module.exports = loginRouter;
