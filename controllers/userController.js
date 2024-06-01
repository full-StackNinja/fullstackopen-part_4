const User = require("../models/User");
const userRouter = require("express").Router();
const bcrypt = require("bcrypt");

userRouter.get("/", async (req, res) => {
   const allUsers = await User.find({}).populate("blogs");

   res.status(200).json(
      allUsers.map((user) => {
         delete user.hashedPwd;
         return user;
      }),
   );
});

userRouter.post("/", async (req, res, next) => {
   try {
      const userInfo = req.body;
      if (userInfo.password.length < 3)
         return res
            .status(400)
            .json({ error: "Password length must be at least 3 characters" });

      const saltRounds = 10;
      const hashedPwd = await bcrypt.hash(userInfo.password, saltRounds);
      const newUser = new User({
         name: userInfo.name,
         username: userInfo.username,
         password: hashedPwd,
      });
      await newUser.save();
      res.status(201).json(newUser);
   } catch (err) {
      next(err);
   }
});

module.exports = userRouter;
