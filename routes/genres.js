const express = require("express");
const router = express.Router();
const genres = [
  { id: 1, genre: "Comedy" },
  { id: 2, genre: "Horror" },
  { id: 3, genre: "Thriller" },
];
//get genres of VIDLY
router.get("/", (req, res) => {
  res.send(genres);
});
//get genres by id
router.get("/:id", (req, res) => {
  const genre = genres.find((c) => c.id === parseInt(req.params.id));
  if (!genre) return res.status(404).send("ID is not found");
  res.send(genre);
});
//insert genres for VIDLY
router.post("/:id", (req, res) => {
  //validate
  const { error } = validateGenres(req);
  if (error) return res.status(404).send(error);
  //insert
  genre = { id: genres.length + 1, genre: req.body.name };
  genres.push(genre);
  return res.send(genre);
});
//update the genre
router.put("/:id", (req, res) => {
  const genre = genres.find((c) => c.id === parseInt(req.params.id));
  if (!genre) return res.status(404).send("ID is not found");
  const { error } = validateGenres(req);
  if (error) return res.status(404).send(error);
  genre.genre = req.body.genre;
  return res.send(
    `succcessfully updated the id:${req.params.id} with ${req.body.genre}`
  );
});
//delete the genre
router.delete("/:id", (req, res) => {
  const genre = genres.find((c) => c.id === parseInt(req.params.id));
  if (!genre) return res.status(404).send("ID is not found");
  genres.splice(req.params.id - 1, 1);
  return res.send(`sucessfully deleted the id ${req.params.id}`);
});

function validateGenres(req) {
  const schema = Joi.object({
    id: Joi.number(),
    genre: Joi.string().required().min(3),
  });
  return schema.validate(req.body);
}

module.exports = router;
