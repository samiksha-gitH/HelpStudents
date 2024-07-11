const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

const usersControllers = require("../controllers/users.js");

router.get("/signup", wrapAsync(usersControllers.renderSignup));


router.post("/signup", wrapAsync(usersControllers.signup));

router.get("/login", wrapAsync(usersControllers.renderLogin));

// failureRedirect: if user is not authenticated then it should be redirected to login page
router.post("/login",
    saveRedirectUrl,
    passport.authenticate("local",
        {
            failureRedirect: "/login",
            failureFlash: true
        }
    ),
    usersControllers.login);

router.get("/logout", usersControllers.logout);

module.exports = router;