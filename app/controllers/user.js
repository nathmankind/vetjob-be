const { pool } = require("../db");
const {
  hashPassword,
  isEmpty,
  isValidEmail,
  validatePassword,
  comparePassword,
  generateToken,
} = require("../helpers/validation");
const { successMessage, errorMessage, status } = require("../helpers/status");

/**
 * Create A User
 * @param {object} req
 * @param {object} res
 * @returns {object} reflection object
 */
const createUser = async (req, res) => {
  const {
    email,
    password,
    username,
    first_name,
    last_name,
    image_url,
  } = req.body;
  const is_admin = false;

  if (
    isEmpty(email) ||
    isEmpty(password) ||
    isEmpty(first_name) ||
    isEmpty(last_name) ||
    isEmpty(username)
  ) {
    errorMessage.error = "Any field cannot be empty";
    return res.status(status.bad).send(errorMessage);
  }
  if (!isValidEmail(email)) {
    errorMessage.error = "Please enter a valid Email";
    return res.status(status.bad).send(errorMessage);
  }
  if (!validatePassword(password)) {
    errorMessage.error = "Password must be more than eight (8) characters";
    return res.status(status.bad).send(errorMessage);
  }

  const hashedPassword = hashPassword(password);
  const createUserQuery = `INSERT INTO
        users(
          email,
          password,
          first_name,
          last_name,
          username,
          image_url,
          is_admin
        )
        VALUES($1, $2, $3, $4, $5, $6, $7 )
        returning *`;
  const values = [
    email,
    hashedPassword,
    first_name,
    last_name,
    username,
    image_url,
    is_admin,
  ];

  try {
    const { rows } = await pool.query(createUserQuery, values);

    const dbResponse = rows[0];
    delete dbResponse.password;
    const token = generateToken(
      dbResponse.email,
      dbResponse.id,
      dbResponse.is_admin,
      dbResponse.first_name,
      dbResponse.last_name,
      dbResponse.username,
      dbResponse.image_url
    );
    successMessage.data = dbResponse;
    successMessage.data.token = token;
    return res.status(status.created).send(successMessage);
  } catch (error) {
    //check for duplicate values and throw an error if found
    if (error.routine === "_bt_check_unique") {
      errorMessage.error = "User with that email/username already exist";
      return res.status(status.conflict).send(errorMessage);
    }
    console.log(error);
    errorMessage.error = "Operation was not successful";
    return res.status(status.error).send(errorMessage);
  }
};

/**
 * Signin
 * @param {object} req
 * @param {object} res
 * @returns {object} user object
 */

const signinUser = async (req, res) => {
  const { email, password } = req.body;

  if (isEmpty(email) || isEmpty(password)) {
    errorMessage.error = "Email or Password detail is missing";
    return res.status(status.bad).send(errorMessage);
  }

  if (!isValidEmail(email) || !validatePassword(password)) {
    errorMessage.error = "Please enter a valid Email or Password";
    return res.status(status.bad).send(errorMessage);
  }
  const signinUserQuery = "SELECT * FROM users WHERE email = $1";
  try {
    const { rows } = await pool.query(signinUserQuery, [email]);
    const dbResponse = rows[0];

    // check if user exists
    if (!dbResponse) {
      errorMessage.error = "User with this email does not exist";
      return res.status(status.notfound).send(errorMessage);
    }

    //check if password is correct
    if (!comparePassword(dbResponse.password, password)) {
      errorMessage.error = "The password you provided is incorrect";
      return res.status(status.bad).send(errorMessage);
    }
    const token = generateToken(
      dbResponse.email,
      dbResponse.id,
      dbResponse.is_admin,
      dbResponse.first_name,
      dbResponse.last_name,
      dbResponse.username,
      dbResponse.image_url
    );
    delete dbResponse.password;
    successMessage.data = dbResponse;
    successMessage.data.token = token;
    return res.status(status.success).send(successMessage);
  } catch (error) {
    console.log(error);
    errorMessage.error = "Operation was not successful";
    return res.status(status.error).send(errorMessage);
  }
};
const getAllUsers = async (req, res) => {
  const getAllUsersQuery = `SELECT * FROM users`;

  try {
    const { rows } = await pool.query(getAllUsersQuery);
    const dbResponse = rows;
    if (dbResponse[0] === undefined) {
      errorMessage.message = "No users available";
      return res.status(status.success).send(errorMessage);
    }
    dbResponse.map((data) => {
      delete data.password;
      delete data.is_admin;
      delete data.email;
      delete data.createdat;
    });
    successMessage.data = dbResponse;
    return res.status(status.success).send(successMessage);
  } catch (error) {
    console.log(error);
    errorMessage.message = "An error Occured";
    console.log(error);
    return res.status(status.error).send(errorMessage);
  }
};

const getUserProfile = async (req, res) => {
  const { id } = req.params;

  const getUserQuery = `SELECT * FROM users WHERE id=$1`;
  try {
    const { rows } = await pool.query(getUserQuery, [id]);
    const dbResponse = rows;
    if (dbResponse[0] === undefined) {
      errorMessage.error = "No user found";
      return res.status(status.notfound).send(errorMessage);
    }
    dbResponse.map((data) => {
      delete data.password;
    });
    successMessage.data = dbResponse;
    return res.status(status.success).send(successMessage);
  } catch (error) {
    rrorMessage.error = "An error Occured";
    return res.status(status.error).send(errorMessage);
  }
};

module.exports = { createUser, signinUser, getAllUsers, getUserProfile };
