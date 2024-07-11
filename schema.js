const Joi = require("joi");

module.exports.paperSchema = Joi.object({
    paper: Joi.object({
    subject : Joi.string().required(),
    university : Joi.string().required(),
    college : Joi.string().required(),
    year : Joi.number().required().min(1).max(4),
    semester : Joi.number().required().min(1).max(8),
    image : Joi.string()
    // .required(),
    }).required()
});

module.exports.querySchema = Joi.object({
    query: Joi.object({
        question: Joi.string().required(),
    }).required()
})