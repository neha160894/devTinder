const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");

const app = express();

app.post("/signup", async (req, res) => {
    // creating a new instance of user model
    const user = new User({
        firstName: "Neha",
        lastName: "Kashyap",
        emailId: "kashyapneha84@gmail.com",
        password: "neha@123" 
    });
    await user.save();
    res.send("Data added successfully!");
});

connectDB().then(() => {
    console.log("Database connection established...");
    app.listen(3000, () => {
        console.log("Server is successfully listening on port 3000...")
    });
}).catch((err) => {
    console.log("Database cannot be connected...");
});
