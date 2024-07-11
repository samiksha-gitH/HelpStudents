const express = require("express");
const Papers = require("../models/paper.js");
const Query = require("../models/query.js");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {validateQuery, isLoggedIn, isQueryAuthor} = require("../middleware.js");

const queryControllers = require("../controllers/queries.js");

router.post("/", isLoggedIn, validateQuery, wrapAsync(queryControllers.addQuery));

// Delete query
router.delete("/:queryId", isLoggedIn, isQueryAuthor, wrapAsync(queryControllers.deleteQuery));

module.exports = router;
