const express = require("express");
const router = express.Router();
const db = require("../db");
const {
  createUser,
  signinUser,
  getAllUsers,
  getUserProfile,
} = require("../controllers/user");
const verifyToken = require("../middleware/verifyAuth");

router.post("/auth/signup", createUser);
router.post("/auth/login", signinUser);
router.get("/auth/users", getAllUsers);
router.get("/auth/user/:id", getUserProfile);

module.exports = router;
