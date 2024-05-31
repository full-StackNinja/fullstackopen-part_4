const Blog = require("../models/Blog");
const User = require("../models/User");
const initialBlogs = [
   {
      _id: "5a422a851b54a676234d17f7",
      title: "React patterns",
      author: "Michael Chan",
      url: "https://reactpatterns.com/",
      likes: 7,
      __v: 0,
   },
   {
      _id: "5a422aa71b54a676234d17f8",
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
      likes: 5,
      __v: 0,
   },
];

const uniqueBlogId = async () => {
   const blogData = {
      title: " fake title",
      author: "fake author",
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
      _id: "6658aa0404f5a0500223d624",
      name: "Imran",
      username: "immi13",
      hashedPwd: "$2b$10$YMtL6yJlD/Ev0qfXK3Y1.uB8W..OPW2CSU.ygz55dP8z3IU4o3hj6",
      __v: 0,
   },
   {
      _id: "6658aa37ad69a960b5dc55c3",
      name: "Hussain",
      username: "hussain123",
      hashedPwd: "$2b$10$Ox9Eu2aRwFEK/Ek8vEGiee.o3fjLUDfU0TndsZ8Pof.bl1fbryT4G",
      __v: 0,
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
