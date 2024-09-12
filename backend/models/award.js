const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Joi = require('joi');



const AwardSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 100
    },
    description: {
        type: String,
        required: true,
        trim: true,
        minlength: 10,
    },
    date: {
        type: Date,
        required: true,
    },
    image: {
        type: Object,
        default: {
            url: "https://static.vecteezy.com/system/resources/thumbnails/011/947/164/small_2x/silver-user-icon-free-png.png",
            publicId: null
        }
    },
});

const Award = mongoose.model('Award', AwardSchema);



//validate create product
function validateCreateAward(obj) {
    const schema = Joi.object({
        title: Joi.string().trim().min(2).max(100).required(),
        description: Joi.string().trim().min(10).required(),
        date: Joi.date().required()
    });
    return schema.validate(obj);
}

//validate update product
function validateUpdateAward(obj) {
    const schema = Joi.object({
        title: Joi.string().trim().min(2).max(100).optional(),
        description: Joi.string().trim().min(10).optional(),
        date: Joi.date().optional()
    });
    return schema.validate(obj);
}


module.exports = {
    Award,
    validateCreateAward,
    validateUpdateAward
}
