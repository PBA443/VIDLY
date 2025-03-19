const logger = require("./logger"); // Import the custom logger
const express = require("express");
const app = express();

require("./startup/validation");
require("dotenv").config();
require("./startup/db")();
require("./startup/routes")(app);
require("./startup/config")();

const port = process.env.PORT || 3000;
app.listen(port, () => {
  logger.info(`Server is listening on port ${port}...`); // ✅ Use logger, not winston
});
