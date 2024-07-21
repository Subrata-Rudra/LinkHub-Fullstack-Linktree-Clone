const mongoose = require("mongoose");

const linkSchema = mongoose.Schema(
  {
    username: { type: String, required: true },
    displayName: { type: String, required: true },
    link: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Link = mongoose.model("Link", linkSchema);

module.exports = Link;
