const { pool } = require("../db");
const { isEmpty } = require("../helpers/validation");
const { successMessage, errorMessage, status } = require("../helpers/status");

/**
 * Create Comment for a post
 * @param {object} req
 * @param {object} res
 * @returns {object} object reflection
 */
const createComment = async (req, res) => {
  const { user_id } = req.user;
  const { post_id } = req.params;
  const { comment } = req.body;

  if (isEmpty(comment)) {
    errorMessage.error = "Enter a comment";
    return res.status(status.bad).send(errorMessage);
  }

  const createCommentQuery = `INSERT INTO comments(
        post_id, user_id, comment
    ) 
    VALUES ($1, $2, $3) 
    returning *`;
  const values = [post_id, user_id, comment];

  try {
    const { rows } = await pool.query(createCommentQuery, values);
    const dbResponse = rows[0];
    successMessage.data = dbResponse;
    return res.status(status.created).send(successMessage);
  } catch (error) {
    errorMessage.error = "Unable to create comment";
    return res.status(status.error).send(errorMessage);
  }
};

/**
 * Get All Comments
 * @param {object} req
 * @param {object} res
 * @returns {object} array of comments
 */

const getAllComments = async (req, res) => {
  const getAllCommentsQuery = `SELECT * FROM comments ORDER BY id DESC `;

  try {
    const { rows } = await pool.query(getAllCommentsQuery);
    const dbResponse = rows;

    successMessage.data = dbResponse;
    return res.status(status.success).send(successMessage);
  } catch (error) {
    rrorMessage.error = "An error Occured";
    return res.status(status.error).send(errorMessage);
  }
};

/**
 * Get One Post Comment
 * @param {object} req
 * @param {object} res
 * @returns {object} array of comment per post
 */

const getOnePostComments = async (req, res) => {
  const { post_id } = req.params;

  const findOneCommentQuery = `SELECT * FROM comments WHERE post_id=$1`;
  try {
    const { rows } = await pool.query(findOneCommentQuery, [post_id]);
    const dbResponse = rows;

    successMessage.data = dbResponse;
    return res.status(status.success).send(successMessage);
  } catch (error) {
    errorMessage.error = "An error Occured";
    return res.status(status.error).send(errorMessage);
  }
};

/**
 * Update A comment
 * @param {object} req
 * @param {object} res
 * @returns {object} updated comment
 */

const updateComment = async (req, res) => {
  const { id } = req.params;
  const { user_id } = req.user;
  const { comment } = req.body;

  const findCommentQuery = `SELECT * FROM comments WHERE id=$1`;
  const updateCommentQuery = `UPDATE comments SET comment=$1 WHERE id=$2 RETURNING *`;
  try {
    const { rows } = await pool.query(findCommentQuery, [id]);
    const dbResponse = rows[0];

    if (!dbResponse) {
      errorMessage.error = "Comment be found";
      return res.status(status.notfound).send(errorMessage);
    }
    if (dbResponse == []) {
      successMessage.data = dbResponse;
      return res.status(status.success).send(successMessage);
    }
    if (user_id !== dbResponse.user_id) {
      errorMessage.error = "Not authorized to edit this comment";
      return res.status(status.unauthorized).send(errorMessage);
    }
    const values = [comment, id];
    const response = await pool.query(updateCommentQuery, values);
    console.log(response);
    const dbResult = response.rows[0];
    successMessage.data = dbResult;
    return res.status(status.success).send(successMessage);
  } catch (error) {
    console.log(error);
    errorMessage.error = "Operation was not successful";
    return res.status(status.error).send(errorMessage);
  }
};
/**
 * Delete a comment
 * @param {object} req
 * @param {object} res
 * @returns {void} return response comment deleted
 */

const deleteComment = async (req, res) => {
  const { id } = req.params;
  const { user_id } = req.user;
  const deleteCommentQuery = `DELETE FROM comments WHERE id=$1 AND user_id = $2 returning *`;
  try {
    const values = [id, user_id];
    const { rows } = await pool.query(deleteCommentQuery, values);
    const dbResponse = rows[0];
    if (!dbResponse) {
      errorMessage.error = "No comment found";
      return res.status(status.notfound).send(errorMessage);
    }
    successMessage.data = {};
    successMessage.data.message = "Comment Deleted Sucessfully";
    return res.send(status.success).send(successMessage);
  } catch (error) {
    return res.status(status.error).send(error);
  }
};

module.exports = {
  getAllComments,
  updateComment,
  deleteComment,
  createComment,
  getOnePostComments,
};
