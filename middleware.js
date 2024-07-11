const Paper = require("./models/paper")
const Query = require("./models/query.js");
const ExpressError = require("./utils/ExpressError.js");
const { paperSchema, querySchema } = require("./schema.js");
// const { Query } = require("mongoose");

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in to upload Paper");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req, res, next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async(req, res, next)=>{
    let { id } = req.params;
    let paper = await Paper.findById(id);
    if (!paper.owner.equals(res.locals.currUser._id)) {
        req.flash("error", "you dont have permission");
        return res.redirect(`/papers/${id}`);
    }
    next();
}

module.exports.validateListing = (req, res, next) => {
    let { error } = paperSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

module.exports.validateQuery=(req, res, next)=>{
    let {error} = querySchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
};

module.exports.isQueryAuthor = async(req, res, next)=>{
    let { id,queryId } = req.params;
    let query = await Query.findById(queryId);
    if (!query.author.equals(res.locals.currUser._id)) {
        req.flash("error", "you didnt create");
        return res.redirect(`/papers/${id}`);
    }
    next();
}