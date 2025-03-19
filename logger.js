const { createLogger, format, transports } = require("winston");
const { combine, timestamp, prettyPrint } = format;
require("express-async-errors");
require("dotenv").config();
require("winston-mongodb");

const mongoTransport = new transports.MongoDB({
  db: process.env.MONGO_URI, // MongoDB connection
  collection: "logs", // Store everything in a single "logs" collection
  level: "info", // Log only 'info' level and above
});

const logger = createLogger({
  format: combine(timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), prettyPrint()),
  transports: [
    new transports.Console(),
    new transports.File({ filename: "combined.log" }),
    mongoTransport, // Send all logs to MongoDB
  ],
  exceptionHandlers: [
    new transports.File({ filename: "exceptions.log" }),
    mongoTransport, // Store uncaught exceptions in MongoDB
  ],
  rejectionHandlers: [
    new transports.File({ filename: "rejections.log" }),
    mongoTransport, // Store unhandled rejections in MongoDB
  ],
});

module.exports = logger;
