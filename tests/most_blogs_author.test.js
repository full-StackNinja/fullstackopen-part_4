const { test, describe } = require("node:test");
const assert = require("node:assert");
const { mostBlogs } = require("../utils/list_helper");

describe("author with most blogs", () => {
   test("for empty array equals null", () => {
      const blogs = [];
      const result = mostBlogs(blogs);
      assert.strictEqual(result, null);
   });

   test("for array with one blog equals author of that blog", () => {
      const blogs = [
         {
            _id: "5a422b891b54a676234d17fa",
            title: "First class tests",
            author: "Robert C. Martin",
            url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
            likes: 10,
            __v: 0,
         },
      ];

      result = mostBlogs(blogs);

      assert.deepStrictEqual(result, {
         author: "Robert C. Martin",
         blogs: 1,
      });
   });

   test("for a bigger array is found correctly", () => {
      const blogs = [
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
         {
            _id: "5a422b3a1b54a676234d17f9",
            title: "Canonical string reduction",
            author: "Edsger W. Dijkstra",
            url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
            likes: 12,
            __v: 0,
         },
         {
            _id: "5a422b891b54a676234d17fa",
            title: "First class tests",
            author: "Robert C. Martin",
            url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
            likes: 10,
            __v: 0,
         },
         {
            _id: "5a422ba71b54a676234d17fb",
            title: "TDD harms architecture",
            author: "Robert C. Martin",
            url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
            likes: 0,
            __v: 0,
         },
         {
            _id: "5a422bc61b54a676234d17fc",
            title: "Type wars",
            author: "Robert C. Martin",
            url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
            likes: 2,
            __v: 0,
         },
      ];

      const result = mostBlogs(blogs);

      assert.deepStrictEqual(result, {
         author: "Robert C. Martin",
         blogs: 3,
      });
   });
});
