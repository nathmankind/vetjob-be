const moment = require("moment");
const { pool } = require("../db");
const { isEmpty } = require("../helpers/validation");
const { successMessage, errorMessage, status } = require("../helpers/status");

/**
 * Create a blog by admin post
 * @param {object} req
 * @param {object} res
 * @returns {object} reflection object
 */

const createBlogPost = async (req, res) => {
  const { user_id, is_admin } = req.user;
  const { category, title, post, image_url } = req.body;

  if (isEmpty(title)) {
    errorMessage.error = "Title cannot be empty";
    return res.status(status.bad).send(errorMessage);
  }
  if (isEmpty(post)) {
    errorMessage.error = "Post body cannot be empty";
    return res.status(status.bad).send(errorMessage);
  }
  if (isEmpty(category)) {
    errorMessage.error = "Post cannot be empty";
    return res.status(status.bad).send(errorMessage);
  }

  if (is_admin !== true) {
    errorMessage.error = "Not authorized to create a blog post";
    return res.status(status.unauthorized).send(errorMessage);
  }

  const createPostQuery = `INSERT INTO blogpost(
          user_id, title, post, category, image_url
      )
      VALUES ($1, $2, $3, $4, $5)
      returning *`;

  const values = [user_id, title, post, category, image_url];

  try {
    const { rows } = await pool.query(createPostQuery, values);
    const dbResponse = rows[0];
    successMessage.data = dbResponse;
    return res.status(status.created).send(successMessage);
  } catch (error) {
    errorMessage.error = "Unable to create blog post";
    return res.status(status.error).send(errorMessage);
  }
};

const getAllBlogPosts = async (req, res) => {
  const getAllPostQuery = `SELECT * FROM blogpost ORDER BY createdat DESC `;

  try {
    const { rows } = await pool.query(getAllPostQuery);
    const dbResponse = rows;
    if (dbResponse[0] === undefined) {
      errorMessage.message = "No blog post available";
      return res.status(status.notfound).send(errorMessage);
    }
    successMessage.data = dbResponse;
    return res.status(status.success).send(successMessage);
  } catch (error) {
    errorMessage.message = "An error Occured";
    return res.status(status.error).send(errorMessage);
  }
};

const getOneBlogPost = async (req, res) => {
  const { id } = req.params;

  const findOnePostQuery = `SELECT * FROM blogpost WHERE id=$1`;
  try {
    const { rows } = await pool.query(findOnePostQuery, [id]);
    const dbResponse = rows;
    if (dbResponse[0] === undefined) {
      errorMessage.error = "No blog post available";
      return res.status(status.notfound).send(errorMessage);
    }
    successMessage.data = dbResponse;
    return res.status(status.success).send(successMessage);
  } catch (error) {
    rrorMessage.error = "An error Occured";
    return res.status(status.error).send(errorMessage);
  }
};

/**
 * Update An a blog post
 * @param {object} req
 * @param {object} res
 * @returns {object} updated blog post
 */

const updateBlogPost = async (req, res) => {
  const { id } = req.params;
  const { user_id } = req.user;
  const { title, post, category, image_url } = req.body;

  const findPostQuery = `SELECT * FROM blogpost WHERE id=$1`;

  const updateBlogPost = `UPDATE blogpost SET title=$1, post=$2, category=$3 image_url=$4 WHERE id=$5 RETURNING *`;

  try {
    const { rows } = await pool.query(findPostQuery, [id]);
    const dbResponse = rows[0];

    if (!dbResponse) {
      errorMessage.error = "Post Cannot be found";
      return res.status(status.notfound).send(errorMessage);
    }
    if (user_id !== dbResponse.user_id) {
      errorMessage.error = "Not authorized to edit this post";
      return res.status(status.unauthorized).send(errorMessage);
    }

    const postvalues = [title, post, category, image_url, id];

    if (post) {
      const response = await pool.query(updateBlogPost, postvalues);
      const dbResult = response.rows[0];
      successMessage.data = dbResult;
      return res.status(status.success).send(successMessage);
    }
  } catch (error) {
    errorMessage.error = "Operation was not successful";
    return res.status(status.error).send(errorMessage);
  }
};
