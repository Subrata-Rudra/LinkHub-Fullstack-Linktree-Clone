const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const connectDb = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected to host ` + `${conn.connection.host}`.cyan);
  } catch (error) {
    console.log(`Error: ${error.message}`.red.bold);
    process.exit();
  }
};

module.exports = connectDb;
