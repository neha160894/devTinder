const mongoose = require("mongoose");

const connectDB = async () => {
    await mongoose.connect("mongodb+srv://kashyapneha84:mKEHlA4bNxeMcZp5@node-js.0ixazgu.mongodb.net/devTinder");
};

module.exports = connectDB;