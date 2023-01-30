const HttpError = require("../helpers/HttpError");
const { User } = require("../models/user");
const path = require("path");
const fs = require("fs/promises");

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

// async function uploadImageAvatar(req, res, next) {
//   console.log("request====", req);
//   const { avatar } = req;

//   const tmpPath = path.resolve(__dirname, "../tmp", avatar);
//   // console.log(tmpPath);

//   const pablicPath = path.resolve(__dirname, "../public/avatars", avatar);
//   // console.log(pablicPath);

//   try {
//     await fs.rename(tmpPath, pablicPath);
//   } catch (error) {
//     await fs.unlink(tmpPath);
//     throw error;
//   }
//   const { _id } = req.user;
//   const user = await User.findByIdAndUpdate(_id);
//   if (!user || !user.token) return next(new HttpError(401, "Not authorized"));
//   user.avatar = `/public/${avatar}`;
//   await user.save();

//   return res.json({
//     avatarURL: user.avatar,
//   });
// }
const avatarsDir = path.join(__dirname, "../../", "public", "avatars");

const uploadImageAvatar = async (req, res) => {
  // console.log(req.user);
  const { _id: id } = req.user;

  const { originalname, path: tempUpload } = req.file;
  const [extension] = originalname.split(".").reverse();
  const fileName = `${id}.${extension}`;
  const resultUpload = path.join(avatarsDir, fileName);

  await fs.rename(tempUpload, resultUpload);
  const avatarURL = path.join("avatars", fileName);

  await User.findByIdAndUpdate(id, { avatarURL });

  res.json({
    avatarURL,
  });
};

module.exports = {
  current,
  logout,
  updateSubscription,
  uploadImageAvatar,
};
