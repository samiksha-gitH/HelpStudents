const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Papers = require("../models/paper.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const paperControllers = require("../controllers/papers.js");
const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});

router.route("/")
    .get(wrapAsync(paperControllers.index))
    .post(isLoggedIn, upload.single('paper[image]'), validateListing, wrapAsync(paperControllers.createPaper));

// new route
router.get("/new", isLoggedIn, paperControllers.renderNewForm);

router.route("/:id")
.get(wrapAsync(paperControllers.showPapers))
    .put(isLoggedIn, isOwner, upload.single('paper[image]'), validateListing, wrapAsync(paperControllers.updatePaper))
    .delete(isLoggedIn, isOwner, wrapAsync(paperControllers.destroyPaper));

// Edit route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(paperControllers.renderEditForm));

module.exports = router;