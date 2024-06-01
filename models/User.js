const mongoose = require("mongoose");

const { Schema } = mongoose;

const UserSchema = new Schema({
   name: { type: String },
   username: { type: String, required: true, minLength: 3, unique: true },
   password: { type: String, required: true },
   blogs: [{ type: Schema.Types.ObjectId, ref: "Blog" }],
});

UserSchema.set("toJSON", {
   transform: (doc, ret) => {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
   },
});

module.exports = mongoose.model("User", UserSchema);
