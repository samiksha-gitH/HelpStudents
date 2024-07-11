if (process.env.NODE_ENV != "production") {
    require('dotenv').config();
}
const mongoose = require("mongoose");
const initData = require("./data.js");
const Papers = require("../models/papers.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/Papers";

main().then(() => {
    console.log("Connected to db");
}).catch(err => {
    console.log(err);
});

async function main() {
    await mongoose.connect(MONGO_URL)
};

const initDb = async () => {
    await Papers.deleteMany({});
    // Adding Owner to individual paper
    initData.data = initData.data.map((obj) => ({ ...obj, owner: "668d7de59cc23b43510c778f" }));
    await Papers.insertMany(initData.data);
    console.log("Data was saved");
}

initDb();