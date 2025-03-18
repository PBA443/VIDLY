const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const { validate, Movie } = require("../models/movie");
const { Genre } = require("../models/genre");

//get genres of VIDLY
router.get("/", async (req, res) => {
  try {
    const movie = await Movie.find(); // Await the async function
    res.send(movie);
  } catch (error) {
    console.error("Error in route handler:", error.message);
    res.status(500).json({ message: "Internal Server Error" }); // Send a 500 error response
  }
});
//get genres by id
router.get("/:id", async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id); // Query the database
    if (!movie) return res.status(404).json({ message: "Movie not found" }); // Handle not found
    res.json(movie); // Send the movie as JSON
  } catch (error) {
    console.error("Error fetching movie:", error.message);
    res.status(500).json({ message: "Internal Server Error" }); // Handle errors
  }
});
//insert genres for VIDLY
router.post("/", async (req, res) => {
  try {
    // Validate the request body
    const { error } = validate(req.body);
    if (error)
      return res.status(400).json({ message: error.details[0].message }); // Return validation error
    const genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(400).send("Invalid genre");
    // Create a new movie object
    const movie = new Movie({
      movieName: req.body.movieName,
      genre: {
        _id: genre._id,
        name: genre.name,
      },
      director: req.body.director,
      numberInStock: req.body.numberInStock,
      dailyRentalRate: req.body.dailyRentalRate,
    });

    // Save the movie to the database
    const result = await movie.save();

    // Return the new movie
    res.status(201).json(result); // 201 Created status code
  } catch (error) {
    console.error("Error creating movie:", error.message);
    res.status(500).json({ message: "Internal Server Error" }); // Handle errors
  }
});
//update the movie
router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(404).send(error);
  const movie = await Movie.findByIdAndUpdate(req.params.id, {
    movie: req.body.movie,
  });
  if (!movie) return res.status(404).send("ID is not found");

  return res.send(
    `succcessfully updated the id:${req.params.id} with ${req.body.movie}`
  );
});
//delete the movie
router.delete("/:id", async (req, res) => {
  const movie = await Movie.findByIdAndDelete(req.params.id);
  if (!movie) return res.status(404).send("ID is not found");
  return res.send(`sucessfully deleted the id ${req.params.id}`);
});

module.exports = router;
