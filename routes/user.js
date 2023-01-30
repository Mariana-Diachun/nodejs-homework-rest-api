const express = require("express");
const { tryCatchWrapper } = require("../helpers/index");

const {
  current,
  logout,
  updateSubscription,
  uploadImageAvatar,
} = require("../controllers/user.controller");

const { updateSubscriptionSchema } = require("../middlewares/schemas");

const { auth, upload } = require("../middlewares/index");

const userRouter = express.Router();

userRouter.get("/current", tryCatchWrapper(auth), tryCatchWrapper(current));

userRouter.patch(
  "/",
  tryCatchWrapper(updateSubscriptionSchema),
  tryCatchWrapper(updateSubscription)
);

userRouter.post("/logout", tryCatchWrapper(auth), tryCatchWrapper(logout));

userRouter.patch(
  "/avatars",
  tryCatchWrapper(auth),
  upload.single("avatar"),
  tryCatchWrapper(uploadImageAvatar)
);

module.exports = {
  userRouter,
};