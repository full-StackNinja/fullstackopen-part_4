const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const blogSchema = new Schema({
   title: String,
   author: String,
   user: { type: Schema.Types.ObjectId, ref: "User" },
   url: String,
   likes: Number,
});

blogSchema.set("toJSON", {
   transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString();
      delete returnedObject._id;
      delete returnedObject.__v;
   },
});

module.exports = mongoose.model("Blog", blogSchema);
