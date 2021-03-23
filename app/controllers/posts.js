const { pool } = require("../db");
const { isEmpty } = require("../helpers/validation");
const { successMessage, errorMessage, status } = require("../helpers/status");

/**
 * Create a post
 * @param {object} req
 * @param {object} res
 * @returns {object} reflection object
 */

const createPost = async (req, res) => {
  const { user_id } = req.user;
  const { company, tags, title, post, image_url } = req.body;

  if (isEmpty(title)) {
    errorMessage.error = "Title cannot be empty";
    return res.status(status.bad).send(errorMessage);
  }
  if (isEmpty(company)) {
    errorMessage.error = "Company cannot be empty";
    return res.status(status.bad).send(errorMessage);
  }
  if (isEmpty(post)) {
    errorMessage.error = "Post cannot be empty";
    return res.status(status.bad).send(errorMessage);
  }

  const createPostQuery = `INSERT INTO posts(
        user_id, company, tags, title, post, image_url
    )
    VALUES ($1, $2, $3, $4, $5, $6)
    returning *`;

  const values = [user_id, company, tags, title, post, image_url];

  try {
    const { rows } = await pool.query(createPostQuery, values);
    const dbResponse = rows[0];
    successMessage.data = dbResponse;
    return res.status(status.created).send(successMessage);
  } catch (error) {
    errorMessage.error = "Unable to create post";
    return res.status(status.error).send(errorMessage);
  }
};

/**
 * Get All Posts
 * @param {object} req
 * @param {object} res
 * @returns {object} array of posts
 */

const getAllPosts = async (req, res) => {
  const getAllPostQuery = `SELECT * FROM posts ORDER BY createdat DESC `;

  try {
    const { rows } = await pool.query(getAllPostQuery);
    const dbResponse = rows;
    if (dbResponse[0] === undefined) {
      errorMessage.message = "No post available";
      return res.status(status.notfound).send(errorMessage);
    }
    successMessage.data = dbResponse;
    return res.status(status.success).send(successMessage);
  } catch (error) {
    errorMessage.message = "An error Occured";
    return res.status(status.error).send(errorMessage);
  }
};

/**
 * Get One Post
 * @param {object} req
 * @param {object} res
 * @returns {object} array containing one gif
 */

const getOnePost = async (req, res) => {
  const { id } = req.params;

  const findOnePostQuery = `SELECT * FROM posts WHERE id=$1`;
  try {
    const { rows } = await pool.query(findOnePostQuery, [id]);
    const dbResponse = rows;
    if (dbResponse[0] === undefined) {
      errorMessage.error = "No post available";
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
 * Update A Post
 * @param {object} req
 * @param {object} res
 * @returns {object} updated post
 */

const updatePost = async (req, res) => {
  const { id } = req.params;
  const { user_id } = req.user;
  const { company, title, post } = req.body;

  const findPostQuery = `SELECT * FROM posts WHERE id=$1`;

  const updatePost = `UPDATE posts SET company=$1, title=$2, post=$3 WHERE id=$4 RETURNING *`;

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

    const postvalues = [company, title, post, id];

    console.log(postvalues);
    console.log(updatePost);
    if (post) {
      const response = await pool.query(updatePost, postvalues);
      const dbResult = response.rows[0];
      successMessage.data = dbResult;
      return res.status(status.success).send(successMessage);
    }
  } catch (error) {
    console.log(error);
    errorMessage.error = "Operation was not successful";
    return res.status(status.error).send(errorMessage);
  }
};

const deletePost = async (req, res) => {
  const { id } = req.params;
  const { user_id } = req.user;
  const deletePostQuery = `DELETE FROM posts WHERE id=$1 AND user_id = $2 returning *`;
  try {
    const values = [id, user_id];
    const { rows } = await pool.query(deletePostQuery, values);
    const dbResponse = rows[0];
    if (!dbResponse) {
      errorMessage.error = "No post found";
      return res.status(status.notfound).send(errorMessage);
    }
    successMessage.data = {};
    successMessage.data.message = "Post Deleted Sucessfully";
    return res.send(status.success).send(successMessage);
  } catch (error) {
    return res.status(status.error).send(error);
  }
};

module.exports = {
  createPost,
  getAllPosts,
  getOnePost,
  updatePost,
  deletePost,
};
