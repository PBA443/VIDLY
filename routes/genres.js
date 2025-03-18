const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Joi = require("joi");

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

//get genres of VIDLY
router.get("/", async (req, res) => {
  try {
    const movies = await Genre.find(); // Await the async function
    res.send(movies);
  } catch (error) {
    console.error("Error in route handler:", error.message);
    res.status(500).json({ message: "Internal Server Error" }); // Send a 500 error response
  }
});
//get genres by id
router.get("/:id", async (req, res) => {
  try {
    const genre = await Genre.findById(req.params.id); // Query the database
    if (!genre) return res.status(404).json({ message: "Genre not found" }); // Handle not found
    res.json(genre); // Send the genre as JSON
  } catch (error) {
    console.error("Error fetching genre:", error.message);
    res.status(500).json({ message: "Internal Server Error" }); // Handle errors
  }
});
//insert genres for VIDLY
router.post("/", async (req, res) => {
  try {
    // Validate the request body
    const { error } = validateGenres(req.body);
    if (error)
      return res.status(400).json({ message: error.details[0].message }); // Return validation error

    // Create a new genre object
    const genre = new Genre({
      genre: req.body.genre,
      movies: req.body.movies, // Use the movies array directly from the request body
    });

    // Save the genre to the database
    const result = await genre.save();

    // Return the new genre
    res.status(201).json(result); // 201 Created status code
  } catch (error) {
    console.error("Error creating genre:", error.message);
    res.status(500).json({ message: "Internal Server Error" }); // Handle errors
  }
});
//update the genre
router.put("/:id", async (req, res) => {
  const { error } = validateGenres(req.body);
  if (error) return res.status(404).send(error);
  const genre = await Genre.findByIdAndUpdate(
    req.params.id,
    { genre: req.body.genre },
    { new: true }
  );
  if (!genre) return res.status(404).send("ID is not found");

  return res.send(
    `succcessfully updated the id:${req.params.id} with ${req.body.genre}`
  );
});
//delete the genre
router.delete("/:id", async (req, res) => {
  const genre = await Genre.findByIdAndDelete(req.params.id);
  if (!genre) return res.status(404).send("ID is not found");
  return res.send(`sucessfully deleted the id ${req.params.id}`);
});

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

module.exports = router;
