const User = require('../models/User');
const Blog = require('../models/Blog');
const router = require('express').Router();
const bcrypt = require('bcrypt');

router.post('/reset', async (req, res) => {
  await Blog.deleteMany({});
  await User.deleteMany({});
  res.status(204).end();
});

router.post('/users', async (req, res, next) => {
  try {
    const { name, username, password } = req.body;
    const salt = 10;
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = new User({ name, username, password: hashedPassword });
    await user.save();
    res.status(201).end();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
