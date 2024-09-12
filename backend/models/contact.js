const mongoose = require('mongoose');
const Joi = require('joi');

const Schema = mongoose.Schema;

const ContactSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 100
    },
    email: {
        type: String,
        required: true,
        minlength: 10
    },
    country: {
        type: String
    },
    phone: {
        type: Number,
        required: true
    },

    message: {
        type: String,
        // required: true
    },

    created_at: {
        type: Date,
        default: Date.now
    },
});

const Contact = mongoose.model('Contact', ContactSchema);

//validate create contact
function validateCreateContact(obj) {
    const schema = Joi.object({
        name: Joi.string().trim().min(2).max(100).required(),
        email: Joi.string().trim().min(10).required(),
        phone: Joi.number().required(),
        country: Joi.string().required(),
        message: Joi.string().optional()  // Ajout de la validation du champ "message"

    });
    return schema.validate(obj);
}


module.exports = {
    Contact,
    validateCreateContact,
}
