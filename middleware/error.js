const logger = require("../logger");
//error handling in application
module.exports = function (err, req, res, next) {
  logger.error(err.message);
  res.status(500).send("Internal Server Error"); // Send a 500 error response
};
