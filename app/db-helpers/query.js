const db = require("../db");

const query = (queryText, params) => {
  return new Promise((resolve, reject) => {
    db.query(queryText, params)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

module.exports = query;
