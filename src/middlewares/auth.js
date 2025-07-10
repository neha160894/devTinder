const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
    try {
        // read the token from the req cookies
        // validate the token
        // find the user
        const { token } = req.cookies;
        if (!token) {
            throw new Error("Token is not valid!");
        }

        const decodedObj = await jwt.verify(token, "DEV@Tinder123");

        const { _id } = decodedObj;

        const user = await User.findById(_id);
        if (!user) {
            throw new Error("User not found!");
        }
        req.user = user;
        next();
    } catch (err) {
        res.status(400).send("ERROR : " + err.message);
    }
};

module.exports = { userAuth };