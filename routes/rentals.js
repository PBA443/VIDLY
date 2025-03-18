const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const { validate, Rental } = require("../models/rental");
const { Customer } = require("../models/customer");
const { Movie } = require("../models/movie");

router.get("/", async (req, res) => {
  try {
    const rentals = await Rental.find().sort("-dateOut"); // Await the async function
    res.send(rentals);
  } catch (error) {
    console.error("Error in route handler:", error.message);
    res.status(500).json({ message: "Internal Server Error" }); // Send a 500 error response
  }
});
//get genres by id
router.get("/:id", async (req, res) => {
  try {
    const genre = await Rental.findById(req.params.id); // Query the database
    if (!genre) return res.status(404).json({ message: "Rental not found" }); // Handle not found
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
    const { error } = validate(req.body);
    if (error)
      return res.status(400).json({ message: error.details[0].message }); // Return validation error

    const customer = await Customer.findById(req.body.customerId);
    if (!customer) return res.status(400).send("Invalid Customer");
    const movie = await Movie.findById(req.body.movieId);
    if (!movie) return res.status(400).send("Invalid Movie");

    if (movie.numberInStock === 0)
      return res.status(400).send("Movie not in stock.");
    // Create a new genre object
    const rental = new Rental({
      customer: {
        _id: customer._id,
        name: customer.name,
        phone: customer.phone,
      },
      movie: {
        _id: movie._id,
        movieName: movie.movieName,
        dailyRentalRate: movie.dailyRentalRate,
      },
    });

    // Save the genre to the database
    const result = await rental.save();

    movie.numberInStock--;
    movie.save();

    // Return the new genre
    res.status(201).json(result); // 201 Created status code
  } catch (error) {
    console.error("Error creating rental", error.message);
    res.status(500).json({ message: "Internal Server Error" }); // Handle errors
  }
});
//update the genre
router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(404).send(error);
  const genre = await Rental.findByIdAndUpdate(req.params.id, {
    name: req.body.genre,
  });
  if (!genre) return res.status(404).send("ID is not found");

  return res.send(
    `succcessfully updated the id:${req.params.id} with ${req.body.genre}`
  );
});
//delete the genre
router.delete("/:id", async (req, res) => {
  const genre = await Rental.findByIdAndDelete(req.params.id);
  if (!genre) return res.status(404).send("ID is not found");
  return res.send(`sucessfully deleted the id ${req.params.id}`);
});

module.exports = router;
