const nodemailer = require("nodemailer");
const { EMAIL_USER, EMAIL_PASS } = process.env;

async function sendMail({ to, html, subject }) {
  try {
    const email = { from: "info@mycontacts.com", to, subject, html };
    const transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
      },
    });

    await transport.sendMail(email);
  } catch (error) {
    console.error("App error", error);
  }
}

function tryCatchWrapper(enpointFn) {
  return async (req, res, next) => {
    try {
      await enpointFn(req, res, next);
    } catch (error) {
      return next(error);
    }
  };
}

module.exports = { tryCatchWrapper, sendMail };
