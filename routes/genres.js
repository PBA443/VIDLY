const auth = require("../middleware/auth");
const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const { validate, Genre } = require("../models/genre");

//get genres of VIDLY
router.get("/", async (req, res) => {
  try {
    const genre = await Genre.find(); // Await the async function
    res.send(genre);
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
router.post("/", auth, async (req, res) => {
  try {
    // Validate the request body
    const { error } = validate(req.body);
    if (error)
      return res.status(400).json({ message: error.details[0].message }); // Return validation error

    // Create a new genre object
    const genre = new Genre({
      name: req.body.name,
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
  const { error } = validate(req.body);
  if (error) return res.status(404).send(error);
  const genre = await Genre.findByIdAndUpdate(req.params.id, {
    name: req.body.genre,
  });
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

module.exports = router;
