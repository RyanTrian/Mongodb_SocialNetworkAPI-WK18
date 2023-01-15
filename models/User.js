const { Schema, model } = require("mongoose");

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/, 
    "Please fill a valid email address"]
  },
  thoughts: {
    type: Schema.Types.ObjectId,
    ref: "Thought"
  },
  friends: {
    type: Schema.Types.ObjectId,
    ref: "User"
  }
})

const User = model('User', UserSchema);

module.exports = {
  User
};
