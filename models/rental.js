const Joi = require("joi");
const mongoose = require("mongoose");

// Create the Genre model
const Rental = new mongoose.model(
  "Rental",
  new mongoose.Schema({
    customer: {
      type: new mongoose.Schema({
        name: {
          type: String,
          required: true,
          minlength: 5,
          maxlength: 50,
        },
        isGold: {
          type: Boolean,
          default: false,
        },
        phone: {
          type: String,
          required: true,
          minlength: 5,
          maxlength: 50,
        },
      }),
      required: true,
    },
    movie: {
      type: new mongoose.Schema({
        movieName: {
          type: String,
          required: true,
          minlength: 5,
          maxlength: 255,
        },
        dailyRentalRate: {
          type: Number,
          required: true,
          min: 0,
          max: 255,
        },
      }),
      required: true,
    },
    dateOut: {
      type: Date,
      required: true,
      default: Date.now,
    },
    dateReturned: {
      type: Date,
    },
    rentalFee: {
      type: Number,
      min: 0,
    },
  })
);

//validate the genres
function validateRental(rental) {
  const schema = Joi.object({
    customerId: Joi.objectId().required().messages({
      //"string.base": "customerId must be a string",
      "string.empty": "customerId cannot be empty",
      "any.required": "customerId is required",
    }),
    movieId: Joi.objectId().required().messages({
      //"string.base": "movieId must be a string",
      "string.empty": "movieId cannot be empty",
      "any.required": "movieId is required",
    }),
  });

  return schema.validate(rental);
}

exports.Rental = Rental;
exports.validate = validateRental;
