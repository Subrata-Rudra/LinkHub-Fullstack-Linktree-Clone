const mongoose = require("mongoose");

const visitSchema = mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String },
    visitCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Visit = mongoose.model("Visit", visitSchema);

module.exports = Visit;
