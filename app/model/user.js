const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true, // Optional: Trims whitespace
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true, // Optional: Trims whitespace
    lowercase: true, // Optional: Converts email to lowercase
    match: [/.+@.+\..+/, "Please fill a valid email address"], // Optional: Email format validation
  },
  password: {
    type: String,
    required: true,
    minlength: 6, // Optional: Minimum password length
  },
  role: {
    type: String,
    default: "user",
  },
});

// Export the model
const User = mongoose.model("User ", UserSchema);
module.exports = User;
