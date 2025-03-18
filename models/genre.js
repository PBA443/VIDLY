const Joi = require("joi");
const mongoose = require("mongoose");

// Define the schema for a single movie
const movieSchema = new mongoose.Schema({
  movieName: { type: String, required: true },
  director: { type: String, required: true },
});

// Define the schema for a genre
const genreSchema = new mongoose.Schema({
  genre: { type: String, required: true },
  movies: [movieSchema], // Array of movie objects
});

// Create the Genre model
const Genre = new mongoose.model("Genre", genreSchema);

//validate the genres
function validateGenres(genre) {
  const schema = Joi.object({
    genre: Joi.string().min(3).required().messages({
      "string.base": "Genre must be a string",
      "string.empty": "Genre cannot be empty",
      "string.min": "Genre must be at least 3 characters long",
      "any.required": "Genre is required",
    }),
    movies: Joi.array()
      .items(
        Joi.object({
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
        })
      )
      .required()
      .messages({
        "array.base": "Movies must be an array",
        "array.empty": "Movies cannot be empty",
        "any.required": "Movies are required",
      }),
  });

  return schema.validate(genre);
}

exports.Genre = Genre;
exports.validate = validateGenres;
