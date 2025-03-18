const mongoose = require("mongoose");
const Joi = require("joi");

//Define the schema for a customer
const customerSchema = new mongoose.Schema({
  isGold: { type: Boolean, default: false },
  name: { type: String, required: true },
  phone: { type: String, required: true },
});
//create the Customer model
const Customer = new mongoose.model("Customer", customerSchema);

//validating the customer
function validateCustomer(genre) {
  const schema = Joi.object({
    isGold: Joi.boolean(),
    name: Joi.string().min(3).required().messages({
      "string.base": "Name must be a string",
      "string.empty": "Name cannot be empty",
      "string.min": "Name must be at least 3 characters long",
      "any.required": "Name is required",
    }),
    phone: Joi.string().min(3).required().messages({
      "string.base": "Phone must be a string",
      "string.empty": "Phone cannot be empty",
      "string.min": "Phone must be at least 3 characters long",
      "any.required": "Phone is required",
    }),
  });

  return schema.validate(genre);
}

exports.Customer = Customer;
exports.validate = validateCustomer;
