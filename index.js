const logger = require("./logger"); // Import the custom logger
const express = require("express");
const app = express();
const cors = require("cors");

// Enable CORS for all requests
app.use(cors());

// (Optional) Configure specific origins
// app.use(cors({ origin: "http://localhost:5173" }));

require("./startup/validation");
require("dotenv").config();
require("./startup/db")();
require("./startup/routes")(app);
require("./startup/config")();

let port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  logger.info(`Server is listening on port ${port}...`);
});

module.exports = server;
