const HttpError = require("../helpers/HttpError");
const { sendMail } = require("../helpers/index");
const { User } = require("../models/user");
const path = require("path");
const fs = require("fs/promises");
const { BadRequest } = require("http-errors");

async function current(req, res, next) {
  const { _id } = req.user;

  const user = await User.findById(_id);

  if (!user || !user.token) return next(new HttpError(401, "Not authorized"));

  res.json({
    email: user.email,
    subscription: user.subscription,
  });
}

async function logout(req, res, next) {
  const { _id } = req.user;

  const user = await User.findById(_id);

  if (!user || !user.token) return next(new HttpError(401, "Not authorized"));

  await User.findByIdAndUpdate(_id, { $set: { token: null } });

  return res.status(204).json();
}

async function updateSubscription(req, res, next) {
  const { _id } = req.user;
  const { subscription } = req.body;
  const user = await User.findById(_id);

  if (!user || !user.token) return next(new HttpError(401, "Not authorized"));

  const updatedUser = await User.findByIdAndUpdate(
    _id,
    { subscription: subscription },
    { new: true }
  );

  res.json({
    email: user.email,
    subscription: updatedUser.subscription,
  });
}
const avatarsDir = path.join(__dirname, "../", "public", "avatars");

const uploadImageAvatar = async (req, res) => {
  const { _id: id } = req.user;

  const { originalname, path: tempUpload } = req.file;
  const [extension] = originalname.split(".").reverse();
  const fileName = `${id}.${extension}`;
  const resultUpload = path.join(avatarsDir, fileName);

  await fs.rename(tempUpload, resultUpload);
  const avatarURL = path.join("avatars", fileName);
  console.log(avatarURL);

  await User.findByIdAndUpdate(id, { avatarURL });

  res.json({
    avatarURL,
  });
};

async function verifyEmail(req, res, next) {
  const { token } = req.params;
  const user = await User.findOne({
    verifyToken: token,
  });
  if (!user) {
    throw BadRequest("Verify token is not valid!");
  }
  await User.findByIdAndUpdate(user._id, {
    verified: true,
    verifyToken: null,
  });
  return res.json({
    message: "Verification successful",
  });
}

async function resendVerifyEmail(req, res, next) {
  const { email } = req.body;

  if (!email) {
    return next(HttpError(400, "Missing required field email"));
  }

  const user = await User.findOne({
    email,
  });

  if (user.verified) {
    throw BadRequest("Verification has already been passed");
  }

  try {
    await sendMail({
      to: email,
      subject: "Verification email sent",
      html: `<a href="localhost:3000/api/users/verify/${user.verifyToken}">Confirm your email</a>`,
    });

    return res.json({
      message: "Verification email sent",
    });
  } catch (error) {
    console.error(error.message);
  }
}

module.exports = {
  current,
  logout,
  updateSubscription,
  uploadImageAvatar,
  resendVerifyEmail,
  verifyEmail,
};
