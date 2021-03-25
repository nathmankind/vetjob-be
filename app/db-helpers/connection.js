const db = require("../db");

db.on("connect", () => {
  console.log("connected to the db");
});

// \

const createUserTable = () => {
  const createUserQuery = `
  CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
  CREATE TABLE IF NOT EXISTS users(
      id UUID PRIMARY KEY NOT NULL UNIQUE DEFAULT uuid_generate_v4(),
      email VARCHAR(128) UNIQUE NOT NULL,
      password VARCHAR(100) NOT NULL,
      username VARCHAR(200) UNIQUE NOT NULL,
      first_name VARCHAR(100) NOT NULL,
      last_name VARCHAR(100) NOT NULL,
      image_url VARCHAR(100) NULL,
      is_admin BOOL DEFAULT(false),
      createdat TIMESTAMP DEFAULT NOW()
      )`;

  db.query(createUserQuery)
    .then((res) => {
      console.log(res);
      db.end();
    })
    .catch((err) => {
      console.log(err);
      db.end();
    });
};

const createPostTable = () => {
  const createPostQuery = `CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
  CREATE TABLE IF NOT EXISTS
  posts(
      id UUID PRIMARY KEY NOT NULL UNIQUE DEFAULT uuid_generate_v4(),
      user_id UUID NOT NULL,
      company VARCHAR NOT NULL,
      tags TEXT [],
      title VARCHAR NOT NULL,
      post VARCHAR NOT NULL,
      image_url VARCHAR NULL,
      createdat TIMESTAMP DEFAULT NOW(),
      FOREIGN KEY (user_id) REFERENCES "users" (id) ON DELETE CASCADE
  )`;
  db.query(createPostQuery)
    .then((res) => {
      console.log(res);
      db.end();
    })
    .catch((err) => {
      console.log(err);
      db.end();
    });
};

const createCommentTable = () => {
  const createCommentQuery = `CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
  CREATE TABLE IF NOT EXISTS
  comments(
      id UUID PRIMARY KEY NOT NULL UNIQUE DEFAULT uuid_generate_v4(),
      post_id UUID NOT NULL,
      user_id UUID NOT NULL,
      comment VARCHAR NOT NULL,
      createdat TIMESTAMP DEFAULT NOW(),
      FOREIGN KEY (post_id) REFERENCES "posts" (id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES "users" (id) ON DELETE CASCADE
  )`;
  db.query(createCommentQuery)
    .then((res) => {
      console.log(res);
      db.end();
    })
    .catch((err) => {
      console.log(err);
      db.end();
    });
};

const createTagTable = () => {
  const createTagQuery = `
  CREATE EXTENSIONS IF NOT EXISTS "uuid-ossp";
  CREATE TABLE IF NOT EXISTS tags(
    id UUID PRIMARY KEY NOT NULL UNIQUE DEFAULT uuid_generate_v4(),
    tag VARCHAR NOT NULL,
    createdat TIMESTAMP DEFAULT NOW(),
  )
  `;
  db.query(createTagQuery)
    .then((res) => {
      console.log(res);
      db.end();
    })
    .catch((err) => {
      console.log(err);
      db.end();
    });
};

const createBlogPost = () => {
  const creatBlogPostQuery = `
  CREATE EXTENSIONS IF NOT EXISTS "uuid-ossp";
  CREATE TABLE IF NOT EXISTS blogpost(
    id UUID PRIMARY KEY NOT NULL UNIQUE DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    category TEXT [] NULL,
    title VARCHAR NOT NULL,
    post VARCHAR NOT NULL,
    image_url VARCHAR NULL,
    createdat TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES "users" (id) ON DELETE CASCADE
  )
  `;
  db.query(creatBlogPostQuery)
    .then((res) => {
      console.log(res);
      db.end();
    })
    .catch((err) => {
      console.log(err);
      db.end();
    });
};

const createAllTables = () => {
  createUserTable(), createPostTable(), createCommentTable();
};

db.on("remove", () => {
  console.log("db removed");
  process.exit(0);
});

module.exports = { createAllTables };
