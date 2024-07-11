const Query = require("../models/query.js");
const Papers = require("../models/paper.js");

module.exports.addQuery = async(req, res)=>{
    let paper = await Papers.findById(req.params.id);
    let newQuery = new Query(req.body.query);
    newQuery.author = req.user._id;
    console.log(newQuery.author);
    paper.queries.push(newQuery);
    await newQuery.save();
    await paper.save();
    req.flash("success", "New query is uploaded");
    // console.log("new q saved");
    // res.send("q saved");
    res.redirect(`/papers/${paper._id}`);
}

module.exports.deleteQuery = async(req, res)=>{
    let {id, queryId} = req.params;
    await Papers.findByIdAndUpdate(id, {$pull:{queries: queryId}})
    await Query.findByIdAndDelete(queryId);
    req.flash("success", "Query deleted");
    res.redirect(`/papers/${id}`)
}