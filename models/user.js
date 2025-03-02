const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userScheme = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
  },
  email: {
    type: String,
  },
  mobile: {
    type: String,
  },
  address: {
    type: String,
    required: true,
  },
  aadharCardNumber: {
    type: Number,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["voter", "admin"],
    default: "voter",
  },
  isVoted: {
    type: Boolean,
    default: false,
  },
});

userScheme.pre("save", async function (next) {
  const person = this;

  // Hash the password only if modified or new
  if (!person.isModified("password")) return next();

  try {
    // hash password generate
    const salt = await bcrypt.genSalt(10);

    // hash password
    const hashedPassword = await bcrypt.hash(person.password, salt);

    // override plain password with hash password
    person.password = hashedPassword;

    next();
  } catch (error) {
    return next(error);
  }
});

userScheme.methods.comparePassword = async function (candidatePassword) {
  try {
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch;
  } catch (error) {
    throw error;
  }
};

const User = mongoose.model("User", userScheme);
module.exports = User;
