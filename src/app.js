const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const { validateSignUpData }  = require("./utils/validation");
const bcrypt = require("bcrypt");

const app = express();

app.use(express.json()); // middleware to convert incoming json from api to JS object

app.post("/signup", async (req, res) => {
    try {
        // validation of data
        validateSignUpData(req);

        const { firstName, lastName, emailId, password } = req.body;

        // encrypt the password
        const passwordHash = await bcrypt.hash(password, 10);

        // creating a new instance of user model
        const user = new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash
        });
        await user.save();
        res.send("Data added successfully!");
    } catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
});

app.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body;

        const user = await User.findOne({ emailId: emailId });
        if (!user) {
            throw new Error("Invalid credentials!");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (isPasswordValid) {
            res.send("Login successful!");
        } else {
            throw new Error("Invalid credentials!");
        }
    } catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
})

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
        res.status(400).send("Something went wrong...");
    }
})

// feed API - GET /feed - get all the users from the database
app.get("/feed", async (req, res) => {
    try {
        const users = await User.find({});
        res.send(users);
    } catch (err) {
        res.status(400).send("Something went wrong...");
    }
});

app.delete("/user", async (req, res) => {
    const userId = req.body.userId;
    try {
        const user = await User.findByIdAndDelete(userId);
        res.send("User deleted successfully");
    } catch (err) {
        res.status(400).send("Something went wrong...");
    }
});

// update data of the user
app.patch("/user/:userId", async (req, res) => {
    const userId = req.params?.userId;
    const data = req.body;

    try {
        const ALLOWED_UPDATES = ["photoUrl", "about", "gender", "age", "skills"];

        const isUpdateAllowed = Object.keys(data).every((k) => ALLOWED_UPDATES.includes(k));

        if (!isUpdateAllowed) {
            throw new Error("Update not allowed");
        }

        if (data?.skills.length > 10) {
            throw new Error("Skills cannot be more than 10");
        }

        await User.findByIdAndUpdate({ _id: userId }, data, { runValidators: true });
        res.send("User updated successfully");
    } catch (err) {
        res.status(400).send("UPDATE FAILED:" + err.message);
    }
});

connectDB().then(() => {
    console.log("Database connection established...");
    app.listen(3000, () => {
        console.log("Server is successfully listening on port 3000...");
    });
}).catch((err) => {
    console.log("Database cannot be connected...");
});
