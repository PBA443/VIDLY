const genres = require("../routes/genres");
const customer = require("../routes/customers");
const movies = require("../routes/movies");
const rentals = require("../routes/rentals");
const registers = require("../routes/users");
const auth = require("../routes/auth");
const express = require("express");
const error = require("../middleware/error");

module.exports = function (app) {
  app.use(express.json());
  app.use("/api/genres", genres);
  app.use("/api/customers", customer);
  app.use("/api/movies", movies);
  app.use("/api/rentals", rentals);
  app.use("/api/users", registers);
  app.use("/api/auth", auth);
  app.use(error);
};
