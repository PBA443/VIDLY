const jwt = require("jsonwebtoken");
const Joi = require("joi");
const mongoose = require("mongoose");
const { joiPasswordExtendCore } = require("joi-password");
const joiPassword = Joi.extend(joiPasswordExtendCore);

// Define the schema for a genre
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET);
  return token;
};

// Create the Genre model
const User = new mongoose.model("User", userSchema);

//validate the genres
function validateUsers(user) {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    email: Joi.string().email(),
    password: joiPassword
      .string()
      .minOfSpecialCharacters(1)
      .minOfLowercase(3)
      .minOfUppercase(1)
      .minOfNumeric(1)
      .noWhiteSpaces()
      .onlyLatinCharacters()
      .doesNotInclude(["password"])
      .messages({
        "password.minOfUppercase":
          "{#label} should contain at least {#min} uppercase character",
        "password.minOfSpecialCharacters":
          "{#label} should contain at least {#min} special character",
        "password.minOfLowercase":
          "{#label} should contain at least {#min} lowercase character",
        "password.minOfNumeric":
          "{#label} should contain at least {#min} numeric character",
        "password.noWhiteSpaces": "{#label} should not contain white spaces",
        "password.onlyLatinCharacters":
          "{#label} should contain only latin characters",
        "password.doesNotInclude": "{#label} is too common",
      }),
  });

  return schema.validate(user);
}

exports.User = User;
exports.validate = validateUsers;
