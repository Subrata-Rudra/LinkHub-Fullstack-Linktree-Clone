const mongoose = require("mongoose");

const subscriberSchema = mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: [
      {
        type: String,
        required: true,
        // unique: true,
      },
    ],
    count: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Subscriber = mongoose.model("Subscriber", subscriberSchema);

module.exports = Subscriber;
