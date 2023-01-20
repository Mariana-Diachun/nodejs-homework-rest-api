const express = require("express");
const { tryCatchWrapper } = require("../helpers/index");

const {
  getContacts,
  createContact,
  current,
} = require("../controllers/user.controller");

const { auth } = require("../middlewares/index");

const userRouter = express.Router();

userRouter.post(
  "/contacts",
  tryCatchWrapper(auth),
  tryCatchWrapper(createContact)
);
userRouter.get(
  "/contacts",
  tryCatchWrapper(auth),
  tryCatchWrapper(getContacts)
);
userRouter.get("/current", tryCatchWrapper(auth), tryCatchWrapper(current));

module.exports = {
  userRouter,
};
