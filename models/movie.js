const Joi = require("joi");
const mongoose = require("mongoose");
const { genreSchema } = require("./genre");

// Define the schema for a single movie
const movieSchema = new mongoose.Schema({
  movieName: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
  },
  genre: {
    type: genreSchema,
    required: true,
  },
  numberInStock: {
    type: Number,
    required: true,
    min: 0,
    max: 255,
  },
  dailyRentalRate: {
    type: Number,
    required: true,
    min: 0,
    max: 255,
  },
});

// Create the Genre model
const Movie = new mongoose.model("Movie", movieSchema);

//validate the genres
function validateGenres(movie) {
  const schema = Joi.object({
    movieName: Joi.string().min(3).required().messages({
      "string.base": "Movie name must be a string",
      "string.empty": "Movie name cannot be empty",
      "string.min": "Movie name must be at least 3 characters long",
      "any.required": "Movie name is required",
    }),
    director: Joi.string().min(3).required().messages({
      "string.base": "Director must be a string",
      "string.empty": "Director cannot be empty",
      "string.min": "Director must be at least 3 characters long",
      "any.required": "Director is required",
    }),
    numberInStock: Joi.number().min(0).required().messages({
      "string.base": "numberInStock must be a number",
      "string.empty": "numberInStock cannot be empty",
      "string.min": "numberInStock must be at least 3 characters long",
      "any.required": "numberInStock is required",
    }),
    dailyRentalRate: Joi.number().min(0).required().messages({
      "string.base": "dailyRentalRate must be a number",
      "string.empty": "dailyRentalRate cannot be empty",
      "string.min": "dailyRentalRate must be at least 3 characters long",
      "any.required": "dailyRentalRate is required",
    }),
    genreId: Joi.string().required(),
  });

  return schema.validate(movie);
}

exports.Movie = Movie;
exports.validate = validateGenres;
