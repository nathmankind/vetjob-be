const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const bycrypt = require("bcrypt");

dotenv.config();

/**
 * isValidEmail helper method
 * @param {string} email
 * @returns {Boolean} True or False
 */
const isValidEmail = (email) => {
  const regEx = /\S+@\S+\.\S+/;
  return regEx.test(email);
};

/**
 * validatePassword helper method
 * @param {string} password
 * @returns {Boolean} True or False
 */
const validatePassword = (password) => {
  if (password.length < 8 || password === "") {
    return false;
  }
  return true;
};

/**
 * Hash password
 * @param {string} password
 * @return {string} hashed password
 */
const saltRounds = 10;
const salt = bycrypt.genSaltSync(saltRounds);
const hashPassword = (password) => bycrypt.hashSync(password, salt);

/**
 * Compare password
 * @param {string} password
 * @param {string} hashedpassword
 * @return {Boolean} True or False
 */
const comparePassword = (hashedPassword, password) => {
  return bycrypt.compareSync(password, hashedPassword);
};

/**
 * isEmpty helper method
 * @param {string, integer} input
 * @returns {Boolean} True or False
 */
const isEmpty = (input) => {
  if (input === undefined || input === "") {
    return true;
  }
  if (input.replace(/\s/g, "").length) {
    return false;
  }
  return true;
};

/**
 * empty helper method
 * @param {string, integer} input
 * @returns {Boolean} True or False
 */
const empty = (input) => {
  if (input === undefined || input === "") {
    return true;
  }
};

/**
 * Generate token
 * @param {string} id
 * @returns {string} token
 */
const generateToken = (email, id, is_admin, firstName, lastName) => {
  const token = jwt.sign(
    {
      email,
      user_id: id,
      firstName,
      lastName,
      is_admin,
    },
    process.env.SECRET_KEY,
    { expiresIn: 600 * 60 }
  );
  return token;
};
module.exports = {
  isValidEmail,
  validatePassword,
  isEmpty,
  empty,
  generateToken,
  hashPassword,
  comparePassword,
};
