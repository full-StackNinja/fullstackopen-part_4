const { dummy } = require("../utils/list_helper");
const { test, describe } = require("node:test");
const assert = require("node:assert");

test("dummy always returns 1", () => {
   const blogs = [];
   const result = dummy(blogs);
   assert.strictEqual(result, 1);
});
