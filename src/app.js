const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");

const app = express();

app.use(express.json()); // middleware to convert incoming json from api to JS object

app.post("/signup", async (req, res) => {
    // creating a new instance of user model
    const user = new User(req.body);

    try {
        await user.save();
        res.send("Data added successfully!");
    } catch (err) {
        res.status(400).send("Error saving the user: " + err.message);
    }
    
});

// ger user by email
app.get("/user", async (req, res) => {
    const userEmail = req.body.emailId;
    try {
        const users = await User.find({ emailId: userEmail });
        if (users.length === 0) {
            res.status(404).send("User not found");
        } else {
            res.send(users);
        }
    } catch (err) {
        res.status(400).send("Something went wrong...")
    }
})

// feed API - GET /feed - get all the users from the database
app.get("/feed", async (req, res) => {
    try {
        const users = await User.find({});
        res.send(users);
    } catch (err) {
        res.status(400).send("Something went wrong...")
    }
});

connectDB().then(() => {
    console.log("Database connection established...");
    app.listen(3000, () => {
        console.log("Server is successfully listening on port 3000...")
    });
}).catch((err) => {
    console.log("Database cannot be connected...");
});
