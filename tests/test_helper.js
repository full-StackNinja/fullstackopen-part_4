const Blog = require("../models/Blog");
const User = require("../models/User");
const initialBlogs = [
   {
      title: "this is second blog of user imran123",
      author: "Imran Hussain",
      url: "fakeurl.com",
      likes: 5,
      user: "665a026c518539a225569daa",
      _id: "665a96642605986db4f2fa0e",
   },
   {
      title: "this is third blog of user imran123",
      author: "Imran Hussain",
      url: "fakeurl.com",
      likes: 5,
      user: "665a026c518539a225569daa",
      _id: "665a9c988134bf9ba3a3bf98",
   },
   {
      title: "this is first blog of user fuzzi123",
      author: "Fuzail Raza",
      url: "fakeurl.com",
      likes: 5,
      user: "665a9a5dca90e52ac4ab1930",
      _id: "665aa1b256922a19eb282aad",
   },
   {
      title: "this is second blog of user fuzzi123",
      author: "Fuzail Raza",
      url: "fakeurl.com",
      likes: 5,
      user: "665a9a5dca90e52ac4ab1930",
      _id: "665aa1bb56922a19eb282ab1",
   },
];

const uniqueBlogId = async () => {
   const blogData = {
      title: " fake title",
      author: "fake author",
      user: initialUsers[0].id,
      url: "www.fakeurl.com",
      likes: 0,
   };
   const newBLog = new Blog(blogData);
   await newBLog.save();
   await newBLog.deleteOne();
   return newBLog._id.toString();
};

const blogsInDb = async () => {
   const blogsList = await Blog.find({});

   return blogsList;
};

const initialUsers = [
   {
      name: "Imran Hussain",
      username: "immi123",
      password: "fakepassword",
      blogs: ["665a96642605986db4f2fa0e", "665a9c988134bf9ba3a3bf98"],
      _id: "665a026c518539a225569daa",
   },
   {
      name: "Fuzail Raza",
      username: "fuzzi123",
      password: "fakepassword",
      blogs: ["665aa1b256922a19eb282aad", "665aa1bb56922a19eb282ab1"],
      _id: "665a9a5dca90e52ac4ab1930",
   },
];

const usersInDb = async () => {
   const usersList = await User.find({});
   return usersList;
};

const uniqueUserId = async () => {
   const newUser = new User({
      name: "fake",
      username: "toofake",
      password: "fakePassword",
   });
   await newUser.save;
   await newUser.deleteOne;
   return newUser._id.toString();
};
module.exports = {
   initialBlogs,
   uniqueBlogId,
   blogsInDb,
   initialUsers,
   usersInDb,
   uniqueUserId,
};
