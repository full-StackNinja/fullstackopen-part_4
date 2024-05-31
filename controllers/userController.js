const User = require("../models/User");
const userRouter = require("express").Router();
const bcrypt = require("bcrypt");

userRouter.get("/", async (req, res) => {
   const allUsers = await User.find({});
   res.status(200).json(allUsers);
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
         hashedPwd,
      });
      await newUser.save();
      res.status(201).json(newUser);
   } catch (err) {
      next(err);
   }
});

module.exports = userRouter;
