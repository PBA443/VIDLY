//error handling in application
module.exports = function (err, req, res, next) {
  console.error("Error in route handler:");
  res.status(500).send("Internal Server Error"); // Send a 500 error response
};
