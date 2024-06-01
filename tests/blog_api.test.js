const { test, describe, beforeEach, after } = require("node:test");
const assert = require("node:assert");
const testHelper = require("./test_helper");
const mongoose = require("mongoose");
const app = require("../app");
const supertest = require("supertest");
const Blog = require("../models/Blog");
const User = require("../models/User");

const api = supertest(app);

describe("Blog List Tests", () => {
   let user;
   let token;
   beforeEach(async () => {
      await Blog.deleteMany({});
      for (let blog of testHelper.initialBlogs) {
         const newBLog = new Blog(blog);
         await newBLog.save();
      }

      const loginInfo = await api.post("/api/login").send({
         username: "immi123",
         password: "fakepassword",
      });
      // console.log("🚀 ~ loginInfo ~ loginInfo:", loginInfo.body)
      const username = loginInfo.body.username;
      token = loginInfo.body.token;
      // console.log("🚀 ~ beforeEach ~ token:", token)
      user = await User.findOne({ username });
      // console.log("🚀 ~ beforeEach ~ user:", user)
   });
   after(async () => {
      await mongoose.connection.close();
      console.log("connection closed");
   });
   describe("GET /api/blogs", () => {
      test("gets blogs in json format", async () => {
         return api
            .get("/api/blogs")
            .expect(200)
            .expect("Content-Type", /application\/json/);
      });

      test("current blogs equal to initial blogs", async () => {
         const initialBlogs = await testHelper.blogsInDb();

         const response = await api.get("/api/blogs");
         assert.strictEqual(response.body.length, initialBlogs.length);
      });

      test("returned blogs have 'id' property instead of '_id'", async () => {
         const response = await api.get("/api/blogs");

         response.body.forEach((blog) => {
            assert(
               blog.hasOwnProperty("id"),
               "Object does not have property 'id'",
            );
         });
      });
   });

   describe("POST /api/blogs", () => {
      test("creates new blog", async () => {
         // console.log("🚀 ~ test ~ user:", user);
         // console.log('token', token)
         const newBlog = {
            title: "This is New Blog",
            author: "Imran Hussain",
            user: user._id,
            url: "www.fakeurl.com",
            likes: 12,
         };

         await api
            .post("/api/blogs")
            .set("Authorization", `Bearer ${token}`)
            .send(newBlog)
            .expect(201)
            .expect(/This is New Blog/);

         const response = await api.get("/api/blogs");

         assert.strictEqual(
            response.body.length,
            testHelper.initialBlogs.length + 1,
         );
      });

      test("correctly saves the sent blog", async () => {
         const uniqueId = await testHelper.uniqueBlogId();
         const newBlog = {
            title: "This is New Blog",
            author: "Imran Hussain",
            user: user._id.toString(),
            url: "www.fakeurl.com",
            likes: 12,
            _id: uniqueId,
         };

         // console.log("🚀 ~ test ~ newBlog:", newBlog);

         const response = await api
            .post("/api/blogs")
            .set("Authorization", `Bearer ${token}`)
            .send(newBlog);
         // console.log("🚀 ~ test ~ response.body:", response.body);

         delete newBlog._id;

         assert.deepStrictEqual(response.body, {
            ...newBlog,
            id: uniqueId,
         });
      });
      test("does not create new blog if token is missing", async () => {
         const newBlog = {
            title: "This is New Blog",
            author: "Imran Hussain",
            user: user._id,
            url: "www.fakeurl.com",
            likes: 12,
         };

         await api
            .post("/api/blogs")
            .set("Authorization", "Bearer ")
            .send(newBlog)
            .expect(401);

         const response = await api.get("/api/blogs");
         assert.strictEqual(
            response.body.length,
            testHelper.initialBlogs.length,
         );
      });
      test("default value of likes property is 0", async () => {
         const uniqueId = await testHelper.uniqueBlogId();
         const newBlog = {
            title: "This is New Blog",
            author: "Imran Hussain",
            user: user._id.toString(),
            url: "www.fakeurl.com",
            _id: uniqueId,
         };
         const response = await api
            .post("/api/blogs")
            .set("Authorization", `Bearer ${token}`)
            .send(newBlog)
            .expect(201);
         assert.deepStrictEqual(response.body, {
            title: newBlog.title,
            author: newBlog.author,
            url: newBlog.url,
            id: newBlog._id,
            user: newBlog.user,
            likes: 0,
         });
      });

      test("title and url is required", async () => {
         const uniqueId = await testHelper.uniqueBlogId();
         const newBlog = {
            author: "Imran Hussain",
            user: user._id.toString(),
            url: "www.fakeurl.com",
            _id: uniqueId,
         };

         await api
            .post("/api/blogs")
            .set("Authorization", `Bearer ${token}`)
            .send(newBlog)
            .expect(400)
            .expect(/title is required/);
         const blogsInDb = await testHelper.blogsInDb();
         assert.strictEqual(testHelper.initialBlogs.length, blogsInDb.length);
      });
   });

   describe("deleting a blog", () => {
      test("deletes blog successfully if it exist", async () => {
         const blogList = testHelper.initialBlogs;
         // console.log("🚀 ~ test ~ blogList:", blogList)

         const singleBlog = blogList[0];
         // console.log("🚀 ~ test ~ singleBlog:", singleBlog);
         await api
            .delete(`/api/blogs/${singleBlog._id}`)
            .set("Authorization", `Bearer ${token}`)
            .expect(200);

         const response = await api.get("/api/blogs");
         assert.strictEqual(
            response.body.length,
            testHelper.initialBlogs.length - 1,
         );
      });
      test("fails with status 400 if id does not exist", async () => {
         const nonExistingId = await testHelper.uniqueBlogId();
         await api
            .delete(`/api/blogs/${nonExistingId}`)
            .set("Authorization", `Bearer ${token}`)
            .expect(400);
      });
   });
   describe("updating an existing blog", () => {
      test("succeeds in updation if data is complete", async () => {
         const blogList = await testHelper.blogsInDb();
         const blogToUpdate = blogList[0];
         const updatedBlog = { ...blogToUpdate, likes: 100 };
         await api
            .put(`/api/blogs/${blogToUpdate.id}`)
            .send(blogToUpdate)
            .expect(200);
      });
   });
});
