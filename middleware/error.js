//error handling in application
module.exports = function (err, req, res, next) {
  console.error("Error in route handler:", error.message);
  res.status(500).json({ message: "Internal Server Error" }); // Send a 500 error response
};
