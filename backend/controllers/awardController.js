const fs = require('fs')
const path = require('path')
const asyncHandler = require('express-async-handler')
const { Award, validateCreateAward, validateUpdateAward } = require('../models/award')
const { cloudinaryUploadImage, cloudinaryRemoveImage } = require('../utils/cloudnary')


/**-------------------------------------------------
* @desc Create new award                           
* @router /api/award                                     
* @method POST                                       
* @acces Only logged in user                         
---------------------------------------------------*/

module.exports.createAwardCtrl = asyncHandler(async (req, res) => {

    //validate image 
    if (!req.file) return res.status(400).json({ message: "Please upload an image" });
    //validate data 
    const { error } = validateCreateAward(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    //upload photo
    const imagePath = path.join(__dirname, `../images/${req.file.filename}`)
    const result = await cloudinaryUploadImage(imagePath);
    //create new award and save it to the database 
    const award = await Award.create({
        title: req.body.title,
        description: req.body.description,
        date: req.body.date,
        image: {
            url: result.secure_url,
            publicId: result.public_id
        },
    });
    //send response to the client
    res.status(201).json({
        message: "Award created successfully",
        award
    });
    //remove image for server  
    fs.unlinkSync(imagePath)
})

/**--------------------------------------------------
* @desc get all awards                           
* @router /api/award/all                                    
* @method GET                          
* @acces all visitors and users                         
---------------------------------------------------*/
module.exports.getAllAwardsCtrl = asyncHandler(async (req, res) => {
    let awards;
    awards = await Award.find().sort({ createdAt: -1 })
    res.status(200).json(awards);
})


/**--------------------------------------------------
* @desc get single award                           
* @router /api/award/:id                                    
* @method GET                          
* @acces all visitors and users                         
---------------------------------------------------*/
module.exports.getSingleAwardsCtrl = asyncHandler(async (req, res) => {
    const award = await Award.findById(req.params.id)//.populate("user",["-password"]);
    if (!award) {
        return res.status(404).json({ message: 'award not fount' })
    }
    res.status(200).json(award);

})



/**--------------------------------------------------
* @desc delete award                          
* @router /api/award/delete/:id                                    
* @method DELETE                          
* @acces Only admin and super admin                         
---------------------------------------------------*/
module.exports.deleteAwardsCtrl = asyncHandler(async (req, res) => {
    const award = await Award.findById(req.params.id)//.populate("user",["-password"]);
    if (!award) {
        return res.status(404).json({ message: 'award not fount' })
    }
    // if (req.user.isSuperAdmin || req.user._id === award.user.toString()) {
    await Award.findByIdAndDelete(req.params.id);

    await cloudinaryRemoveImage(award.image.publicId);

    // res.status(200).json(award);
    res.status(200).json({
        message: "post has been deleted successfully",
        awardId: award._id
    });
    // } else {
    //     res.status(403).json({
    //         message: "access denied",
    //     }
    //     )
    // }

})




/**--------------------------------------------------
* @desc update award                          
* @router /api/award/:id                                    
* @method PUT                          
* @acces Only admin and super admin                         
---------------------------------------------------*/
module.exports.updateAwardsCtrl = asyncHandler(async (req, res) => {
    //validation
    // console.log(req.body)

    const { error } = validateUpdateAward(req.body);
    //const user = await User.findById(req.params.id).select('-password');
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    // get award from db and check if exist
    // console.log(req.params.id)
    // console.log(req.body)
    const award = await Award.findById(req.params.id);
    if (!award) {
        return res.status(404).json({ message: 'award not found ' })
    }
    //check if this post belong to ligged in user 
    // if (req.user._id !== award.user.toString()) {
    //     return res
    //         .status(403)
    //         .json({ message: "access denied, you are not allowed" });
    // }
    // 4. Update award
    const updatedAward = await Award.findByIdAndUpdate(
        req.params.id,
        {
            $set: {
                title: req.body.title,
                description: req.body.description,
                date: req.body.date,
            },
        },
        { new: true }
    )
    // 5. Send response to the client

    res.status(200).json(updatedAward);

})




/**-----------------------------------------------
 * @desc    Update award Image
 * @route   /api/award/upload-image/:id
 * @method  PUT
 * @access  private (only owner of the post)
 ------------------------------------------------*/
module.exports.updateAwardImageCtrl = asyncHandler(async (req, res) => {
    // 1. Validation
    if (!req.file) {
        return res.status(400).json({ message: "no image provided" });
    }

    // 2. Get the post from DB and check if post exist
    const award = await Award.findById(req.params.id);
    if (!award) {
        return res.status(404).json({ message: "award not found" });
    }

    // 3. Check if this post belong to logged in user
    if (req.user._id !== award.user.toString()) {
        return res
            .status(403)
            .json({ message: "access denied, you are not allowed" });
    }

    // 4. Delete the old image
    await cloudinaryRemoveImage(award.image.publicId);

    // 5. Upload new photo
    const imagePath = path.join(__dirname, `../images/${req.file.filename}`);
    const result = await cloudinaryUploadImage(imagePath);

    // 6. Update the image field in the db
    const updatedAward = await Award.findByIdAndUpdate(
        req.params.id,
        {
            $set: {
                image: {
                    url: result.secure_url,
                    publicId: result.public_id,
                },
            },
        },
        { new: true }
    );

    // 7. Send response to client
    res.status(200).json(updatedAward);

    // 8. Remvoe image from the server
    fs.unlinkSync(imagePath);
});