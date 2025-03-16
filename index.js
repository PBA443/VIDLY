require("dotenv").config();
const Joi = require("joi");
const express = require("express");
const app = express();
const genres = require("./routes/genres");
app.use(express.json());
const port = process.env.PORT || 3000;
app.use("/api/genres", genres);
app.listen(port, () => {
  console.log(`Server is listening on port ${port}...`);
});
