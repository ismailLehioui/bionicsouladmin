const fs = require('fs')
const path = require('path')
const asyncHandler = require('express-async-handler')
const { Partner, validateCreatePartner, validateUpdatePartner } = require('../models/partner')
const { cloudinaryUploadImage, cloudinaryRemoveImage } = require('../utils/cloudnary')


/**--------------------------------------------------
* @desc Create new partner                           
* @router /api/partner                                     
* @method POST                                       
* @acces Only logged in user                         
---------------------------------------------------*/

module.exports.createPartnerCtrl = asyncHandler(async (req, res) => {
    //validate image 
    if (!req.file) return res.status(400).json({ message: "Please upload an image" });
    //validate data 
    const { error } = validateCreatePartner(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    //upload photo
    const imagePath = path.join(__dirname, `../images/${req.file.filename}`)
    // console.log(__dirname)
    // console.log(imagePath)
    const result = await cloudinaryUploadImage(imagePath);
    // console.log(result)

    //create new partner and save it to the database 
    const partner = await Partner.create({
        name: req.body.name,
        description: req.body.description,
        website: req.body.website,
        // user: req.user._id,
        image: {
            url: result.secure_url,
            publicId: result.public_id
        },
    });
    //send response to the client
    res.status(201).json({
        message: "partner created successfully",
        partner
    });
    //remove image for server  
    fs.unlinkSync(imagePath)
})

/**--------------------------------------------------
* @desc get all partners                           
* @router /api/partner/all                                    
* @method GET                          
* @acces all visitors and users                         
---------------------------------------------------*/
module.exports.getAllPartnersCtrl = asyncHandler(async (req, res) => {
    // const POST_PER_PAGE = 3;
    // const { pageNumber, category } = req.query;
    // let partners;
    // if (pageNumber) {
    //     partners = await Partner.find()
    //         .skip((pageNumber - 1) * POST_PER_PAGE)
    //         .limit(POST_PER_PAGE)
    //         .sort({ createdAt: -1 });
    // } else if (category) {
    //     partners = await Partner.find({ category }).sort({ createdAt: -1 })
    // } else {
    //     partners = await Partner.find().sort({ createdAt: -1 })
    // }
    // res.status(200).json(partners);
    const partners = await Partner.find()//.populate('user','name');
    res.status(200).json({
        message: "partners fetched successfully",
        partners
    })

})


/**--------------------------------------------------
* @desc get single partner                           
* @router /api/partner/:id                                    
* @method GET                          
* @acces all visitors and users                         
---------------------------------------------------*/
module.exports.getSinglePartnerCtrl = asyncHandler(async (req, res) => {
    const partner = await Partner.findById(req.params.id)//.populate("user",["-password"]);
    if (!partner) {
        return res.status(404).json({ message: 'partner not fount' })
    }
    res.status(200).json(partner);

})



/**--------------------------------------------------
* @desc delete partner                          
* @router /api/partner/delete/:id                                    
* @method DELETE                          
* @acces Only admin and super admin                         
---------------------------------------------------*/
module.exports.deletePartnerCtrl = asyncHandler(async (req, res) => {
    const partner = await Partner.findById(req.params.id)//.populate("user",["-password"]);
    if (!partner) {
        return res.status(404).json({ message: 'partner not fount' })
    }
    // if (req.user.isSuperAdmin || req.user._id === partner.user.toString()) {
    await Partner.findByIdAndDelete(req.params.id);
    await cloudinaryRemoveImage(partner.image.publicId);

    // res.status(200).json(partner);
    res.status(200).json({
        message: "post has been deleted successfully",
        partnerId: partner._id
    });
    // } else {
    //     res.status(403).json({
    //         message: "access denied",
    //     }
    //     )
    // }

})




/**---------------------------------------------------
* @desc update partner                          
* @router /api/partner/:id                                    
* @method PUT                          
* @acces Only admin and super admin                         
---------------------------------------------------*/
module.exports.updatePartnerCtrl = asyncHandler(async (req, res) => {
    //validation
    const { error } = validateUpdatePartner(req.body);
    //const user = await User.findById(req.params.id).select('-password');
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    // get partner from db and check if exist
    const partner = await Partner.findById(req.params.id);
    if (!partner) {
        return res.status(404).json({ message: 'partner not found ' })
    }
    //check if this post belong to ligged in user 
    // if (req.user._id !== partner.user.toString()) {
    //     return res
    //         .status(403)
    //         .json({ message: "access denied, you are not allowed" });
    // }
    // 4. Update partner
    const upadatePartner = await Partner.findByIdAndUpdate(
        req.params.id,
        {
            $set: {
                name: req.body.name,
                description: req.body.description,
                website: req.body.website,
            },
        },
        { new: true }
    )
    /*.populate("user", ["-password"])
  .populate("comments");*/

    // 5. Send response to the client
    res.status(200).json(upadatePartner);

})




/**-----------------------------------------------
 * @desc    Update partner Image
 * @route   /api/partner/upload-image/:id
 * @method  PUT
 * @access  private (only owner of the post)
 ------------------------------------------------*/
module.exports.updatePartnerImageCtrl = asyncHandler(async (req, res) => {
    // 1. Validation
    if (!req.file) {
        return res.status(400).json({ message: "no image provided" });
    }

    // 2. Get the post from DB and check if post exist
    const partner = await Partner.findById(req.params.id);
    if (!partner) {
        return res.status(404).json({ message: "partner not found" });
    }

    // 3. Check if this post belong to logged in user
    // if (req.user._id !== partner.user.toString()) {
    //     return res
    //         .status(403)
    //         .json({ message: "access denied, you are not allowed" });
    // }

    // 4. Delete the old image
    await cloudinaryRemoveImage(partner.image.publicId);

    // 5. Upload new photo
    const imagePath = path.join(__dirname, `../images/${req.file.filename}`);
    const result = await cloudinaryUploadImage(imagePath);

    // 6. Update the image field in the db
    const upadatePartner = await Partner.findByIdAndUpdate(
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
    res.status(200).json(upadatePartner);

    // 8. Remvoe image from the server
    fs.unlinkSync(imagePath);
});
