const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");

const { User } = require("../models/user");

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

async function auth(req, res, next) {
  const authHeaders = req.headers.authorization || "";

  const [type, token] = authHeaders.split(" ");
  if (type !== "Bearer" || !token) {
    throw new HttpError(401, "Not authorized");
  }

  try {
    const { id } = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(id);

    if (!user) return next(new HttpError(404, "Not found"));

    req.user = user;
  } catch (error) {
    if (
      error.name === "TokenExpiredError" ||
      error.name === "JsonWebTokenError"
    ) {
      throw new HttpError(401, "JWT token is not valid");
    }
    throw error;
  }
  next();
}

const tempDir = path.join(__dirname, "../", "temp");

const multerConfig = multer.diskStorage({
  destination: tempDir,
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
  limits: {
    fileSize: 1024,
  },
});

const upload = multer({
  storage: multerConfig,
});

// const multerConfig = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, path.resolve(__dirname, "../tmp"));
//   },
//   filename: function (req, file, cb) {
//     cb(null, Math.random() + file.originalname);
//   },
// });

// const upload = multer({
//   multerConfig,
//   limits: {
//     fileSize: 1048576,
//   },
// });

module.exports = {
  validateBody,
  auth,
  upload,
};
