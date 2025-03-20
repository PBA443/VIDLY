const Joi = require("joi");
const mongoose = require("mongoose");

// Define the schema for a genre
const genreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 20,
  },
});

// Create the Genre model
const Genre = new mongoose.model("Genre", genreSchema);

//validate the genres
function validateGenres(genre) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(20).required().messages({
      "string.base": "Genre must be a string",
      "string.empty": "Genre cannot be empty",
      "string.min": "Genre must be at least 3 characters long",
      "any.required": "Genre is required",
    }),
  });

  return schema.validate(genre);
}

exports.genreSchema = genreSchema;
exports.Genre = Genre;
exports.validate = validateGenres;
