const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const { Customer, validate } = require("../models/customer");

//get genres of VIDLY
router.get("/", async (req, res) => {
  try {
    const movies = await Customer.find(); // Await the async function
    res.send(movies);
  } catch (error) {
    console.error("Error in route handler:", error.message);
    res.status(500).json({ message: "Internal Server Error" }); // Send a 500 error response
  }
});
//get genres by id
router.get("/:id", async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id); // Query the database
    if (!customer)
      return res.status(404).json({ message: "Customer not found" }); // Handle not found
    res.json(customer); // Send the genre as JSON
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

    // Create a new genre object
    const customer = new Customer({
      isGold: req.body.isGold,
      name: req.body.name,
      phone: req.body.phone, // Use the movies array directly from the request body
    });

    // Save the genre to the database
    const result = await customer.save();

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
  const customer = await Customer.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name },
    { new: true }
  );
  if (!customer) return res.status(404).send("ID is not found");

  return res.send(
    `succcessfully updated the id:${req.params.id} with ${req.body.genre}`
  );
});
//delete the genre
router.delete("/:id", async (req, res) => {
  const customer = await Customer.findByIdAndDelete(req.params.id);
  if (!customer) return res.status(404).send("ID is not found");
  return res.send(`sucessfully deleted the id ${req.params.id}`);
});

module.exports = router;
