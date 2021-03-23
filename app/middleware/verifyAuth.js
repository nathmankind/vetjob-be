const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { errorMessage, status } = require("../helpers/status");

dotenv.config();

/**
 * Verify Token
 * @param {object} req
 * @param{object} res
 * @param {object} next
 * @returns {object|void} response object
 */

const verifyToken = async (req, res, next) => {
  const { token } = req.headers;
  if (!token) {
    errorMessage.message = "Token not provided";
    return res.status(status.bad).send(errorMessage);
  }
  try {
    const decodeToken = jwt.verify(token, process.env.SECRET_KEY);
    req.user = {
      email: decodeToken.email,
      user_id: decodeToken.user_id,
      firstName: decodeToken.firstName,
      lastName: decodeToken.lastName,
      is_admin: decodeToken.is_admin,
    };
    /**
     * moving to the next request handler with next() cos its a middleware
     */
    next();
  } catch (error) {
    errorMessage.message = "Authenticaion Failed";
    return res.status(status.unauthorized).send(errorMessage);
  }
};

module.exports = verifyToken;
