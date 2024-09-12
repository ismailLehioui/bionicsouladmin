const Joi = require('joi');
const mongoose = require('mongoose');

const ProductSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 500
    },
    description: {
        type: String,
        required: true,
        trim: true,
        minlength: 10
    },
    image: {
        type: Object,
        default: {
            url: '',
            PublicId: null
        }
    },
    price: {
        type: Number,
        required: true,
    },
    
    // user: String
    // {
        // type: mongoose.Schema.Types.ObjectId,
        // ref: "User",
        
    // }
    // category: {
    //     type: String,
    //     required: true,
    //     trim: true,
    //     minlength:2,
    //     maxlength:200
    // },
    // content: {
    //     type: String
    // }
}, {
    timestamps: true
})

const Product = mongoose.model('Product', ProductSchema);

//validate create product
function validateCreateProduct(obj) {
    const schema = Joi.object({
        title: Joi.string().trim().min(2).max(200).required(),
        description: Joi.string().trim().min(10).required(),
        price: Joi.number().required()
        // category: Joi.string().trim().min(2).max(200).required(),
    });
    return schema.validate(obj);
}

//validate update product
function validateUpdateProduct(obj) {
    const schema = Joi.object({
        title: Joi.string().trim().min(2).max(200),
        description: Joi.string().trim().min(10),
        price: Joi.number()
        // category: Joi.string().trim().min(2).max(200),
    });
    return schema.validate(obj);
}


module.exports = {
    Product,
    validateCreateProduct,
    validateUpdateProduct,
};