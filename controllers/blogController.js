const router = require("express").Router();
const Blog = require("../models/Blog");

router.get("/", (req, res) => {
   Blog.find({}).then((blogs) => {
      res.json(blogs);
   });
});

router.post("/", (req, res, next) => {
   const blog = new Blog(req.body);
   blog
      .save()
      .then((result) => {
         res.status(201).json(result);
      })
      .catch((err) => {
         res.status(400).json({ error: err.message });
      });
});

module.exports = router;
