const { test, describe, beforeEach, after } = require("node:test");
const assert = require("node:assert");
const testHelper = require("./test_helper");
const mongoose = require("mongoose");
const app = require("../app");
const supertest = require("supertest");
const Blog = require("../models/Blog");

const api = supertest(app);

describe("Blog List Tests", () => {
   beforeEach(async () => {
      await Blog.deleteMany({});
      for (let blog of testHelper.initialBlogs) {
         const newBLog = new Blog(blog);
         await newBLog.save();
      }
   });
   after(async () => {
      await mongoose.connection.close();
   });
   describe.skip("GET /api/blogs", () => {
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

   describe.skip("POST /api/blogs", () => {
      test("creates new blog", async () => {
         const newBlog = {
            title: "This is New Blog",
            author: "Imran Hussain",
            url: "www.fakeurl.com",
            likes: 12,
         };
         await api
            .post("/api/blogs")
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
            url: "www.fakeurl.com",
            likes: 12,
            _id: uniqueId,
         };

         const response = await api.post("/api/blogs").send(newBlog);
         delete newBlog._id;

         assert.deepStrictEqual(response.body, {
            ...newBlog,
            id: uniqueId,
         });
      });

      test("default value of likes property is 0", async () => {
         const uniqueId = await testHelper.uniqueBlogId();
         const newBlog = {
            title: "This is New Blog",
            author: "Imran Hussain",
            url: "www.fakeurl.com",
            _id: uniqueId,
         };
         const response = await api
            .post("/api/blogs")
            .send(newBlog)
            .expect(201);
         assert.deepStrictEqual(response.body, {
            title: newBlog.title,
            author: newBlog.author,
            url: newBlog.url,
            id: newBlog._id,
            likes: 0,
         });
      });

      test("title and url is required", async () => {
         const uniqueId = await testHelper.uniqueBlogId();
         const newBlog = {
            author: "Imran Hussain",
            url: "www.fakeurl.com",
            _id: uniqueId,
         };

         const response = await api
            .post("/api/blogs")
            .send(newBlog)
            .expect(400)
            .expect(/title is required/);
         const blogsInDb = await testHelper.blogsInDb();
         assert.strictEqual(testHelper.initialBlogs.length, blogsInDb.length);
      });
   });

   describe.skip("deleting a blog", () => {
      test("deletes blog successfully if it exist", async () => {
         const blogList = (await api.get("/api/blogs")).body;
         const singleBlog = blogList[0];
         await api.delete(`/api/blogs/${singleBlog.id}`).expect(204);

         const response = await api.get("/api/blogs");
         assert.strictEqual(
            response.body.length,
            testHelper.initialBlogs.length - 1,
         );
      });
      test("fails with status 400 if id does not exist", async () => {
         const nonExistingId = await testHelper.uniqueBlogId();
         await api.delete(`/api/blogs/${nonExistingId}`).expect(400);
      });
   });
   describe.skip("updating an existing blog", () => {
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
