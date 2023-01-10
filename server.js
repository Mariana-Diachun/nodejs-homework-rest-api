const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

mongoose.set("strictQuery", false);

const { HOST_URI } = process.env;

async function main() {
  try {
    console.log(HOST_URI);
    await mongoose.connect(HOST_URI);
    console.log("Database connection successful");
  } catch (error) {
    console.error(error.message);
  }
  process.exit(1);
}

main();
