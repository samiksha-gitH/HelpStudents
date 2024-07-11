if (process.env.NODE_ENV != "production") {
    require('dotenv').config();
}
console.log(process.env.SECRET);

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");//ejs template
const methodOverride = require("method-override");
const ejs = require("ejs");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

// express routers
const papersRouter = require("./routes/paper.js");
const queriesRouter = require("./routes/query.js");
const usersRouter = require("./routes/user.js");

const dbUrl = process.env.ATLAS_DBURL;

main().then(() => {
    console.log("Connected to db");
}).catch(err => {
    console.log(err);
});

async function main() {
    await mongoose.connect(dbUrl)
};

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

// app.get("/testPapers", async(req, res)=>{
//     const samplePaper = new Papers({
//         subject : "Data Structures",
//         year: 2019,
//         university: "SPTU",
//         semester: 5,
//         college: "PICT",
//         image:"https://in.images.search.yahoo.com/search/images?p=question+papers&fr=mcafee&type=E210IN885G0&imgurl=https%3A%2F%2Findiaprint.in%2Fwp-content%2Fuploads%2F2020%2F04%2Fa5-1-1143x1536.jpg#id=1&iurl=https%3A%2F%2Fcdn.10yearsquestionpaper.com%2Fimg%2Ficse%2Fcomputer%2F2016-previous-year-question-paper-01.jpg&action=click"
//     })
//     await samplePaper.save();
//     console.log("Sample was saved");
//     res.send("Successful testing");
// })

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto:{
        secret:process.env.SECRET
    },
    touchAfter: 24*3600
});

store.on("error", ()=>{
    console.log("Error in mongo session store", err);
})
// Session option
const sessionOption = {
    store,
    secret: process.env.SECRET,
    // if you dont write below two options then warning: resave, saveuninitialized
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,//after 1 week
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true,//for security purpose(cross scripting attacks)
    },
};

// app.get("/", (req, res) => {
//     res.send("Hi i am root");
// });

// To use session option
app.use(session(sessionOption));
app.use(flash());

// Password related
app.use(passport.initialize());//when new password enters, passport initialize 
app.use(passport.session());//
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Middleware for flash success & falilure
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    // currUser used in navbar.ejs
    res.locals.currUser = req.user;
    next();
});

// Creating a demo user
// app.get("/demouser", async(req,res)=>{
//     let fakeUser = new User({
//         email : "abcd@gmail.com",
//         username: "abcdfge"
//     });
//     // to store this fakeuser use User ka register method
//     let registeredUser = await User.register(fakeUser, "helloworld");
//     res.send(registeredUser);
// })

// papers route
app.use("/papers", papersRouter);
// Query routes
app.use("/papers/:id/queries", queriesRouter);
app.use("/", usersRouter);

// -------------------------------------
// ExpressError 
// If we are accessing a page which our website dont have
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});

// Error handling middlewares
// 2. ExpressError
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something Went Wrong" } = err;
    res.status(statusCode).render("error.ejs", { message });
    // res.status(statusCode).send(message);
});

// app.use((err, req, res, next) => {
//     let { statusCode = 500, message = "Something Went Wrong!" } = err;
//     res.status(statusCode).render("error.ejs", { message });
//     // res.status(statusCode).send(message);
// });

// 1. WrapAsync
// app.use((err, req, res, next) => {
//     res.send("Something Went Wrong");
// });



app.listen(8080, (req, res) => {
    console.log("Listening to port 8080");
});