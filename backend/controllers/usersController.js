const asyncHandler = require("express-async-handler")
const { User, validateUpdateUser } = require('../models/user');
const bcrypt = require('bcrypt');
const path = require('path');
const { cloudinaryUploadImage, cloudinaryRemoveImage } = require('../utils/cloudnary')
const fs = require('fs')

/**--------------------------------------------------
* @desc Get All Users Profiles
* @router /api/user/all 
* @method GET
* @acces  Super Admin and Admin 
---------------------------------------------------*/
module.exports.getAllUsersCtrl = asyncHandler(async (req, res) => {
    const users = await User.find().select('-password');
    res.status(200).json(users);
})

/**--------------------------------------------------
* @desc Get User Profile by id
* @router /api/user/profile/id
* @method GET
* @acces Only Admin 
---------------------------------------------------*/
module.exports.getUserCtrl = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
        return res.status(404).json({ message: "user not found" })
    }
    res.status(200).json(user);
})

/**--------------------------------------------------
* @desc Update User Profile 
* @router /api/user/profile/id
* @method PUT
* @acces private Only user himself 
---------------------------------------------------*/
module.exports.updateUserProfileCtrl = asyncHandler(async (req, res) => {
    //validation
    const { error } = validateUpdateUser(req.body);
    //const user = await User.findById(req.params.id).select('-password');
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    //check password (if user want to change password)

    if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
    }
    //update
    const updateUser = await User.findByIdAndUpdate(
        req.params.id, {
        $set: {
            name: req.body.name,
            lastname: req.body.lastname,
            password: req.body.password,
            // bio: req.body.bio
        }
    },
        {
            new: true
        }
    ).select("-password");
    res.status(200).json(updateUser);
});


/**--------------------------------------------------
* @desc Get User Profile by id
* @router /api/user/profile/profile-photo-upload
* @method POST
* @acces Only logged in user 
---------------------------------------------------*/
module.exports.profilePhotoUploadCtrl = asyncHandler(async (req, res) => {
    //validation
    if (!req.file) {
        return res.status(400).json({ message: 'no file provided' })
    }
    // get the path to the image
    const imagePath = path.join(__dirname, `../images/${req.file.filename}`);
    //get the user from db 
    const user = await User.findById(req.params.id);
    // upload to cloudnary
    const result = await cloudinaryUploadImage(imagePath);
    //delete the the old profile photo if exist
    if (user.profilePhoto.publicId !== null) {
        await cloudinaryRemoveImage(user.profilePhoto.publicId)
    }
    //change the photo profile photo in DB
    user.profilePhoto = {
        url: result.secure_url,
        publicId: result.public_id,
    }
    await user.save();
    //send respense to client 
    res.status(200).json({
        message: "your profile photo uploaded successfully",
        profilePhoto: {
            url: result.secure_url,
            publicId: result.public_id

        }
    })
    //remove image from server 
    fs.unlinkSync(imagePath);


})
