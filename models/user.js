const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email:{
        type: String,
        required: true,
    },
});
userSchema.plugin(passportLocalMongoose);//it is because, it will add username, password, hashing, salting, etc. it also has password authentication.

module.exports=mongoose.model("User",userSchema);