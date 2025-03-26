const logger = require("../logger");
const mongoose = require("mongoose");
module.exports = function () {
  mongoose.connect(process.env.MONGO_URI).then(() => {
    logger.info("Connected to MongoDB...");
  });
};
