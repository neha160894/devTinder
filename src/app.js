const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const { validateSignUpData }  = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth");

const app = express();

app.use(express.json()); // middleware to convert incoming json from api to JS object
app.use(cookieParser); // middleware to parse cookie (installed cookie-parser library)

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

        const isPasswordValid = await user.validatePassword(password);

        if (isPasswordValid) {
            // create a jwt token
            const token = await user.getJWT();

            // add the token to cookie and send the response bac to the user
            res.cookie("token", token, {
                expires: new Date(Date.now() + 8 * 3600000),
            });
            res.send("Login successful!");
        } else {
            throw new Error("Invalid credentials!");
        }
    } catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
});

app.get("/profile", userAuth, async (req, res) => {
    try {
        const user = req.user;
        res.send(user);
    } catch (err) {
        res.status(400).send("ERROR : " + err.message);
    }
});

app.post("/sendConnectionRequest", userAuth, async (req, res) => {
    const user = req.user;
    res.send(user.firstName + " sent connection request!");
})

connectDB().then(() => {
    console.log("Database connection established...");
    app.listen(3000, () => {
        console.log("Server is successfully listening on port 3000...");
    });
}).catch((err) => {
    console.log("Database cannot be connected...");
});
