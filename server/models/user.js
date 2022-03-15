const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  created: {
    type: Date,
    default: Date.now,
  },
  polls: [{ type: mongoose.Schema.Types.ObjectId, ref: "Poll" }],
});

userSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) {
      return next();
    }
    const hashed = await bcrypt.hash(this.password, 10);
    this.password = hashed;
    return next();
  } catch (err) {
    return next(err);
  }
});

userSchema.methods.comparePassword = async function (attempt, next) {
  try {
    return await bcrypt.compare(attempt, this.password);
  } catch (error) {
    next(error);
  }
};
module.exports = mongoose.model("User", userSchema);

//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyMjhkMThhODM1MTFlYmQ0Yjc4M2Y0NyIsInVzZXJuYW1lIjoidGVzdCIsImlhdCI6MTY0Njg0MjI1MH0.beHf7AzqOMmLGVopk6ytxLdqwnit8bkVhZixiyY8V84
