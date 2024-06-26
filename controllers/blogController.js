const router = require('express').Router();
const Blog = require('../models/Blog');
const User = require('../models/User');
const middleware = require('../utils/middleware');

router.get('/', async (req, res) => {
  const blogs = await Blog.find({}).populate('user');
  res.status(200).json(blogs);
});

router.post('/', [
  async (req, res, next) => {
    try {
      const blog = new Blog(req.body);
      const user = req.user;
      console.log('🚀  router.post~ user:', user);
      blog.user = user._id;
      if (!blog.title || !blog.url) {
        return res
          .status(400)
          .json({ error: `${!blog.title ? 'title' : 'url'} is required` });
      } else if (!blog.likes) {
        blog.likes = 0;
      }

      const result = await (await blog.save()).populate('user');
      console.log('🚀 ~ blogController.post ~ result:', result);
      // Add the blog to the user's blogs array
      user.blogs.push(blog._id);
      // then save the updated user
      await User.findByIdAndUpdate(user._id, user);
      res.status(201).json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
]);

router.delete('/:id', [
  async (req, res, next) => {
    try {
      const blogExist = await Blog.findById(req.params.id);
      console.log('🚀 ~ blogExist:', blogExist);
      if (!blogExist) {
        return res.status(400).json({ error: 'blog does not exist' });
      }
      console.log('router.delete ~ req.user', req.user);
      const loggedInUser = await User.findOne({
        username: req.user.username,
      });

      const blogCreatorId = blogExist.user;
      if (loggedInUser._id.toString() === blogCreatorId.toString()) {
        // console.log("condition of deleting blog is true");
        const deletedBlog = await Blog.findByIdAndDelete(req.params.id);
        return res.status(200).json(deletedBlog);
      }
      res.status(401).json({
        error: 'logged in user is not the author of the blog',
      });
    } catch (error) {
      next(error);
    }
  },
]);

router.put('/:id', async (req, res) => {
  const updatedBlog = req.body;
  const newData = await Blog.findByIdAndUpdate(req.params.id, updatedBlog, {
    new: true,
  });
  res.status(200).json(newData);
});

module.exports = router;
