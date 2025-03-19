require("express-async-errors");
const winston = require("winston");
const error = require("./middleware/error");
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

winston.add(new winston.transports.File({ filename: "logfile.log" }));

if (!process.env.JWT_SECRET) {
  console.error("FATAL ERROR: jwt secret is not defined.");
  process.exit(1);
}

const port = process.env.PORT || 3000;

mongoose
  .connect("mongodb://localhost/VIDLY")
  .then(() => {
    console.log("Connected to MongoDB...");
  })
  .catch((err) => {
    console.error("Could not connect to MongoDB...", err);
  });

app.use(express.json());
app.use("/api/genres", genres);
app.use("/api/customers", customer);
app.use("/api/movies", movies);
app.use("/api/rentals", rentals);
app.use("/api/users", registers);
app.use("/api/auth", auth);

app.use(error);

app.listen(port, () => {
  console.log(`Server is listening on port ${port}...`);
});
