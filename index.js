const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const morgan = require("morgan");
const userRoutes = require("./app/routes/user");
const postsRoutes = require("./app/routes/posts");
const commentRoutes = require("./app/routes/posts");

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());
app.use(morgan("tiny"));
app.use(cors());

app.use(morgan("tiny"));
app.use("/api/v1", userRoutes);
app.use("/api/v1/posts", postsRoutes);
app.use("/api/v1/comments", commentRoutes);

app.get("/", (req, res) => {
  return res.json({
    message: "Welcome to vetjobs api v1",
  });
});

app.use(function (req, res, next) {
  let err = new Error("Not Found");
  err.status = 404;
  next(err);
});

if (app.get("env") === "development") {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.send({
      message: err.message,
      error: err,
    });
  });
}

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
