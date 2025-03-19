const winston = require("winston");
//error handling in application
module.exports = function (err, req, res, next) {
  winston.error(err.message);
  console.error("Error in route handler:");
  res.status(500).send("Internal Server Error"); // Send a 500 error response
};
