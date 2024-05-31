const testHelper = require("./test_helper");
const User = require("../models/User");
const { test, describe, beforeEach, after } = require("node:test");
const assert = require("node:assert");

const app = require("../app");
const Supertest = require("supertest");
const mongoose = require("mongoose");
const api = Supertest(app);
describe("User tests", () => {
   beforeEach(async () => {
      await User.deleteMany({});
      await Promise.all(
         testHelper.initialUsers.map((user) => new User(user).save()),
      );
   });
   after(async () => {
      await mongoose.connection.close();
   });
   describe("GET /api/users", () => {
      test("gets users in json format", async () => {
         await api
            .get("/api/users")
            .expect("Content-Type", /application\/json/);
      });
      test("correctly returns initial users", async () => {
         const response = await api.get("/api/users");
         assert.strictEqual(
            response.body.length,
            testHelper.initialUsers.length,
         );
      });
   });
   describe("POST /api/users", () => {
      test("creates user to the database correctly", async () => {
         const newUser = {
            name: "Fuzzi",
            username: "fuzzi123",
            password: "fakepassword",
         };
         const response = await api
            .post("/api/users")
            .send(newUser)
            .expect("Content-Type", /application\/json/)
            .expect(201);
         assert.deepStrictEqual(
            {
               name: response.body.name,
               username: response.body.username,
            },
            { name: "Fuzzi", username: "fuzzi123" },
         );
         const userData = await api.get("/api/users");
         assert.strictEqual(
            userData.body.length,
            testHelper.initialUsers.length + 1,
         );
      });
      test("doesn't create user if password length <3", async () => {
         const newUser = {
            name: "fakename",
            username: "fakeusername",
            password: "ju",
         };
         await api
            .post("/api/users")
            .send(newUser)
            .expect(400)
            .expect({ error: "Password length must be at least 3 characters" });
         const response = await api.get("/api/users");

         assert.strictEqual(
            response.body.length,
            testHelper.initialUsers.length,
         );
      });

      test("doesn't create user with duplicate username", async () => {
         const duplicateUsername = testHelper.initialUsers[0].username;
         const newUser = {
            name: "fakename",
            username: duplicateUsername,
            password: "fakepwd",
         };
         await api
            .post("/api/users")
            .send(newUser)
            .expect(400)
            .expect({ error: "username must be unique" });
         const response = await api.get("/api/users");

         assert.strictEqual(
            response.body.length,
            testHelper.initialUsers.length,
         );
      });
   });
});
