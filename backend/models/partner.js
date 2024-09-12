const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Joi = require('joi');


const PartnerSchema = new Schema({
    name: {
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
    website: {
        type: String,
        required: true,
        trim: true,
    },
    // user: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "User",
    // },
    image: {
        type: Object,
        default: {
            url: "https://static.vecteezy.com/system/resources/thumbnails/011/947/164/small_2x/silver-user-icon-free-png.png",
            publicId: null
        }
    },
});

const Partner = mongoose.model('Partner', PartnerSchema);



//validate create product
function validateCreatePartner(obj) {
    const schema = Joi.object({
        name: Joi.string().trim().min(2).max(100).required(),
        description: Joi.string().trim().min(10).required(),
        website: Joi.string().trim().required()
    });
    return schema.validate(obj);
}

//validate update product
function validateUpdatePartner(obj) {
    const schema = Joi.object({
        name: Joi.string().trim().min(2).max(100).optional(),
        description: Joi.string().trim().min(10).optional(),
        website: Joi.string().trim().optional()
        // category: Joi.string().trim().min(2).max(200),
    });
    return schema.validate(obj);
}


module.exports = {
    Partner,
    validateCreatePartner,
    validateUpdatePartner
}
