const express = require("express");
const router = express.Router();
const db = require("../db");
const verifyToken = require("../middleware/verifyAuth");
const {
  getAllComments,
  getOnePostComments,
  createComment,
  updateComment,
  deleteComment,
} = require("../controllers/comments");

router.post("/:post_id/create", verifyToken, createComment);
router.get("/", getAllComments);
router.get("/:id", getOnePostComments);
router.put("/:id", verifyToken, updateComment);
router.delete("/:id", verifyToken, deleteComment);

module.exports = router;
