const router = require("express").Router();
const Blog = require("../models/Blog");

router.get("/", async (req, res) => {
   const blogs = await Blog.find({});
   res.json(blogs);
});

router.post("/", async (req, res, next) => {
   const blog = new Blog(req.body);

   if (!blog.title || !blog.url) {
      return res
         .status(400)
         .send(`${!blog.title ? "title" : "url"} is required`);
   } else if (!blog.likes) {
      blog.likes = 0;
   }
   try {
      const result = await blog.save();
      res.status(201).json(result);
   } catch (err) {
      res.status(400).json({ error: err.message });
   }
});

router.delete("/:id", async (req, res) => {
   const blogExist = await Blog.findById(req.params.id);
   if (!blogExist) {
      return res.status(400).json({ error: "blog does not exist" });
   }
   const deletedBlog = await Blog.findByIdAndDelete(req.params.id);
   res.status(204).json(deletedBlog);
});

router.put("/:id", async (req, res) => {
   const updatedBlog = req.body;
   const newData = await Blog.findByIdAndUpdate(req.params.id, updatedBlog, {
      new: true,
   });
   res.status(200).json(newData);
});

module.exports = router;
