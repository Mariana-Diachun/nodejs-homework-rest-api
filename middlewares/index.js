const HttpError = require("../helpers/HttpError");

function validateBody(schema) {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return next(new HttpError(400, error.message));
    }
    return next();
  };
}

function auth(req, res, next) {
  console.log("in auth");
  next();
}

module.exports = {
  validateBody,
  auth,
};
