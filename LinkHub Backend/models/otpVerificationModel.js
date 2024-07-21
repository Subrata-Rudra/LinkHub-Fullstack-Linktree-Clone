const mongoose = require("mongoose");

const otpVerificationSchema = mongoose.Schema(
  {
    username: { type: String, required: true },
    otp: { type: String },
    expiresAt: Date,
  },
  {
    timestamps: true,
  }
);

const OTPVerification = mongoose.model(
  "OTPVerification",
  otpVerificationSchema
);

module.exports = OTPVerification;
