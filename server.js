const mongoose = require("mongoose");
const app = require("./app");

const dotenv = require("dotenv");
dotenv.config();

mongoose.set("strictQuery", false);

const { HOST_URI } = process.env;
const PORT = process.env.PORT || 3000;

(async function () {
  try {
    await mongoose.connect(HOST_URI);
    console.log("Database connection successful");
    app.listen(PORT, () => {
      console.log(`Server running. Use our API on port: ${PORT}`);
    });
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
})();
