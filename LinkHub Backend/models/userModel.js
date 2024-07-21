const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    emailVerified: { type: Boolean, required: true, default: false },
    profilePic: {
      type: String,
      default:
        "https://res.cloudinary.com/dor2rxkrs/image/upload/v1703864773/LinkHub%20Media/tyqlucjo4ujdljbpfrcs.png",
    },
    passwordResetToken: { type: String },
    passwordResetTokenExpiresAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model("User", userSchema);

module.exports = User;
