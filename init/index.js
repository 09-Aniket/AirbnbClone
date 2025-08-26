const mongoose = require("mongoose");
const initdata = require("./data.js");
const Listing = require("../models/listing.js");
// const { init } = require("./models/listing");

const MONGO_URL = "mongodb://127.0.0.1:27017/ServiceEra";

main()
  .then(() => {
    console.log("connecting to Db");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});
  // insert owner of every listings
  initdata.data = initdata.data.map((obj) => ({
    ...obj,
    owner: "68a59dc7a47a5ed88e7fc4d5",
  }));
  await Listing.insertMany(initdata.data);

  console.log("Data Was Initialized Successfull:");
};

initDB();
