const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Query = require("./query");

const paperSchema = new Schema({
    subject: {
        type: String,
        // required: true
    },
    year: {
        type: Number,
        required: true
    },
    university: {
        type: String,
        // requied: true
    },
    semester: {
        type: Number,
        required: true
    },
    college: {
        type: String,
        // required: true
    },
    image: {
        filename: String,
        url: String,
    },
    queries:[
        {
            type: Schema.Types.ObjectId,
            ref:"Query",
        },
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref: "User"
    }
});

// if you delete a paper then their queries should also be deleted
paperSchema.post("findOneAndDelete", async(paper)=>{
    if(paper){
    await Query.deleteMany({_id: {$in: paper.queries}});
    }
})
const Papers = mongoose.model("Papers", paperSchema);
module.exports = Papers;