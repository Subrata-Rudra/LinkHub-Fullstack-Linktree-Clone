const express = require("express");
const path = require("path");
const port = process.env.PORT || 5000;
const cors = require("cors");
const dotenv = require("dotenv");
const connectDb = require("./config/db");
const redis = require("./config/redis");
const userRoutes = require("./routes/userRoutes");
const linkRoutes = require("./routes/linkRoutes");
const hubRoutes = require("./routes/hubRoutes");
const publicRoutes = require("./routes/publicRoutes");
const subscribeRoutes = require("./routes/subscribeRoutes");
const colors = require("colors");

dotenv.config();

connectDb();

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

app.use(cors());
app.use(express.json());

app.get("/test", (req, res) => {
  res.json({ Message: "Server is Running...🏃‍♂️", Condition: "OK✅" });
});

app.use("/", publicRoutes);
app.use("/subscribe", subscribeRoutes);
app.use("/user", userRoutes);
app.use("/link", linkRoutes);
app.use("/hub", hubRoutes);

app.listen(port, () => {
  console.log(`Server is running on ` + `http://localhost:${port}`.underline);
});
