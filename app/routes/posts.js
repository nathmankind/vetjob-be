const express = require("express");
const router = express.Router();
const db = require("../db");
const {
  createPost,
  updatePost,
  deletePost,
  getAllPosts,
  getOnePost,
} = require("../controllers/posts");
const verifyToken = require("../middleware/verifyAuth");

router.post("/create", verifyToken, createPost);
router.get("/", getAllPosts);
router.get("/:id", getOnePost);
router.put("/:id", verifyToken, updatePost);
router.delete("/:id", verifyToken, deletePost);

module.exports = router;
