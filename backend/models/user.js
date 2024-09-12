const mongoose = require('mongoose');

const jwt = require('jsonwebtoken');
const joi = require('joi')

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 100
    },
    // lastname: {
    //     type: String,
    //     trim: true,
    //     minlength: 2,
    //     maxlength: 100
    // },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 5,
        maxlength: 100
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 6,
    },
    // about: {
    //     type: String
    // },
    profilePhoto: {
        type: Object,
        default: {
            url: "https://static.vecteezy.com/system/resources/thumbnails/011/947/164/small_2x/silver-user-icon-free-png.png",
            publicId: null
        }
    },
    // bio: {
    //     type: String
    // },
    isSuperAdmin: {
        type: Boolean,
        default: false
    },
    isAccountVerified: {
        type: Boolean,
        default: false
    }


},
    { timestamps: true })


//generate Auth token 
UserSchema.methods.generateAuthToken = function () {
    return jwt.sign({ _id: this._id, isSuperAdmin: this.isSuperAdmin }, process.env.JWT_SECRET,/* { expiresIn: '30d' }*/)
}


//User Model
const User = mongoose.model('User', UserSchema);



//validate register user
function validateRegisterUser(obj) {
    const schema = joi.object({
        name: joi.string().min(2).trim().max(100).required(),
        email: joi.string().min(5).trim().max(100).required(),
        password: joi.string().min(2).trim().required(),
    });
    return schema.validate(obj);
}




//validate register user
function validateLoginUser(obj) {
    const schema = joi.object({
        email: joi.string().min(5).trim().max(100).required(),
        password: joi.string().min(2).trim().required(),
    });
    return schema.validate(obj);
}



//validate register user
function validateUpdateUser(obj) {
    const schema = joi.object({
        name: joi.string().min(5).trim().max(100),
        //email: joi.string().min(5).trim().max(100).required(),
        password: joi.string().min(2).trim(),
        bio: joi.string()
    });
    return schema.validate(obj);
}



module.exports = {
    User,
    validateRegisterUser,
    validateLoginUser,
    validateUpdateUser
};



