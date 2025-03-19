const Joi = require("joi");
const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();
const { User } = require("../models/user");
const _ = require("lodash");
const { joiPasswordExtendCore } = require("joi-password");
const joiPassword = Joi.extend(joiPasswordExtendCore);

router.post("/", async (req, res) => {
  try {
    // Validate the request body
    const { error } = validate(req.body);
    if (error)
      return res.status(400).json({ message: error.details[0].message }); // Return validation error
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send("Invalid email or password");

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword)
      return res.status(400).send("Invalid email or password");
    // Return the new genre
    const token = user.generateAuthToken();
    res.send(token);
  } catch (error) {
    console.error("Error authenticating user:", error.message);
    res.status(500).json({ message: "Internal Server Error" }); // Handle errors
  }
});

function validate(user) {
  const schema = Joi.object({
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
module.exports = router;
