const { Pool } = require("pg");

const dotenv = require("dotenv");

dotenv.config();

const isProduction = process.env.NODE_ENV === "production";

const connectionString = process.env.DATABASE_URL_LOCAL;

const pool = new Pool({
  connectionString: isProduction ? process.env.DATABASE_URL : connectionString,
});

module.exports = { pool };
