require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const genres = require("./routes/genres");
app.use(express.json());
const port = process.env.PORT || 3000;
mongoose
  .connect("mongodb://localhost/movieDatabase")
  .then(() => {
    console.log("Connected to MongoDB...");
  })
  .catch((err) => {
    console.error("Could not connect to MongoDB...", err);
  });
app.use("/api/genres", genres);
app.listen(port, () => {
  console.log(`Server is listening on port ${port}...`);
});
