const successMessage = {
  status: "success",
  data: {
    token: "",
  },
};
const errorMessage = {
  status: "error",
};
const status = {
  success: 200,
  error: 500,
  notfound: 404,
  unauthorized: 401,
  conflict: 409, // e.g when a user inputs an email that already exists
  created: 201,
  bad: 400,
  nocontent: 204,
};

module.exports = { successMessage, errorMessage, status };
