const mongoose = require("mongoose");

const basicDetailsSchema = mongoose.Schema(
  {
    username: { type: String, required: true },
    displayName: { type: String, required: true },
    link: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const BasicDetails = mongoose.model("BasicDetails", basicDetailsSchema);

module.exports = BasicDetails;
