const Papers = require("../models/paper.js");

module.exports.index=async (req, res) => {
    const allPapers = await Papers.find({});
    res.render("papers/index.ejs", { allPapers });
};

module.exports.renderNewForm = (req, res) => {
    res.render("papers/new.ejs");
}

module.exports.showPapers = async (req, res) => {
    let { id } = req.params;
    const paper = await Papers.findById(id).populate({ path: "queries", populate: { path: "author" } }).populate("owner");
    if (!paper) {
        req.flash("error", "The paper you are trying to access is not available");
        res.redirect("/papers");
    }
    // console.log(paper)
    res.render("papers/show.ejs", { paper });
}

module.exports.createPaper = async (req, res, next) => {
    // if (!req.body.paper) {
    //     throw new ExpressError(400, "Send valid data for paper");
    // }
    let url = req.file.path;
    let filename = req.file.filename;
    // console.log(url,",",filename)

    const newPaper = new Papers(req.body.paper);

    // if(!newPaper.subject){
    //     throw new ExpressError(400, "Subject is missing");
    // }
    newPaper.owner = req.user._id;
    newPaper.image = {url, filename};
    const savedPaper = await newPaper.save();
    console.log(savedPaper);
    req.flash("success", "New paper is uploaded");
    res.redirect("/papers");
};

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const paper = await Papers.findById(id);
    if (!paper) {
        req.flash("error", "The paper you are trying to access is not available");
        res.redirect("/papers");
    }
    let originalImageUrl = paper.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_150,w_250")
    res.render("papers/edit.ejs", { paper, originalImageUrl });
}

module.exports.updatePaper = async (req, res) => {
    let { id } = req.params;
    let paper = await Papers.findByIdAndUpdate(id, { ...req.body.paper });

    if(typeof req.file !== "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;

    paper.image = {url, filename}

    await paper.save();
    }
    req.flash("success", "Paper updated");
    res.redirect(`/papers/${id}`);
}

module.exports.destroyPaper = async (req, res) => {
    let { id } = req.params;
    const deletedPaper = await Papers.findByIdAndDelete(id);
    console.log(deletedPaper);
    req.flash("success", "Paper deleted");
    res.redirect("/papers");
}