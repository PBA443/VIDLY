const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const genres = require("./routes/genres");
const customer = require("./routes/customers");
const movies = require("./routes/movies");
const rentals = require("./routes/rentals");
const registers = require("./routes/users");
const auth = require("./routes/auth");

app.use(express.json());

const port = process.env.PORT || 3000;

mongoose
  .connect("mongodb://localhost/VIDLY")
  .then(() => {
    console.log("Connected to MongoDB...");
  })
  .catch((err) => {
    console.error("Could not connect to MongoDB...", err);
  });

app.use("/api/genres", genres);
app.use("/api/customers", customer);
app.use("/api/movies", movies);
app.use("/api/rentals", rentals);
app.use("/api/users", registers);
app.use("/api/auth", auth);

app.listen(port, () => {
  console.log(`Server is listening on port ${port}...`);
});
