const express = require("express");

const profileRouter = express.Router();

const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData, validatePassword } = require("../utils/validation");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
    try {
        const user = req.user;
        res.send(user);
    } catch (err) {
        res.status(400).send("ERROR : " + err.message);
    }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
    try {
        if(!validateEditProfileData(req)) {
            throw new Error("Invalid edit request");
        }

        const loggedInUser = req.user;

        Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

        await loggedInUser.save();

        res.json({
            message: `${loggedInUser.firstName}, your profile was updated successfully`,
            data: loggedInUser
        });
    } catch (err) {
        res.status(400).send("ERROR : " + err.message);
    }
});

profileRouter.patch("/profile/editPassword", userAuth, async (req, res) => {
    try {
        if(!validatePassword(req)) {
            throw new Error("Invalid edit request");
        }

        const loggedInUser = req.user;

        loggedInUser.password = req.body.password;

        await loggedInUser.save();

        res.json({
            message: `${loggedInUser.firstName}, your profile was updated successfully`,
            data: loggedInUser
        });
    } catch (err) {
        res.status(400).send("ERROR : " + err.message);
    }
});

module.exports = profileRouter;