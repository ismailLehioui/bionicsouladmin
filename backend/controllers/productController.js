const fs = require('fs')
const path = require('path')
const asyncHandler = require('express-async-handler')
const { Product, validateCreateProduct, validateUpdateProduct } = require('../models/product')
const { cloudinaryUploadImage, cloudinaryRemoveImage } = require('../utils/cloudnary')


/**-------------------------------------------------
* @desc Create new product                           
* @router /api/product                                     
* @method POST                                       
* @acces Only logged in user                         
---------------------------------------------------*/

module.exports.createProductCtrl = asyncHandler(async (req, res) => {

    // console.log(req.body)
    //validate image 
    if (!req.file) return res.status(400).json({ message: "Please upload an image" });
    //validate data 
    const { error } = validateCreateProduct(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    //upload photo
    const imagePath = path.join(__dirname, `../images/${req.file.filename}`)
    const result = await cloudinaryUploadImage(imagePath);
    //create new product and save it to the database 
    const product = await Product.create({
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        // user: req.user._id,
        image: {
            url: result.secure_url,
            publicId: result.public_id
        },
    });
    //send response to the client
    res.status(201).json({
        message: "Product created successfully",
        product
    });
    //remove image for server  
    fs.unlinkSync(imagePath)
})

/**--------------------------------------------------
* @desc get all products                           
* @router /api/product/all                                    
* @method GET                          
* @acces all visitors and users                         
---------------------------------------------------*/
module.exports.getAllProductsCtrl = asyncHandler(async (req, res) => {
    // const POST_PER_PAGE = 3;
    // const { pageNumber, category } = req.query;
    let products;
    // if (pageNumber) {
    //     products = await Product.find()
    //         .skip((pageNumber - 1) * POST_PER_PAGE)
    //         .limit(POST_PER_PAGE)
    //         .sort({ createdAt: -1 });
    // } else if (category) {
    //     products = await Product.find({ category }).sort({ createdAt: -1 })
    // } else {
    products = await Product.find().sort({ createdAt: -1 })
    // }
    res.status(200).json(products);
    // const products = await Product.find()//.populate('user','name');
    // res.status(200).json({
    //     message: "Products fetched successfully",
    //     products
    // })

})


/**--------------------------------------------------
* @desc get single product                           
* @router /api/product/:id                                    
* @method GET                          
* @acces all visitors and users                         
---------------------------------------------------*/
module.exports.getSingleProductsCtrl = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id)//.populate("user",["-password"]);
    if (!product) {
        return res.status(404).json({ message: 'product not fount' })
    }
    
    res.status(200).json(product);

})



/**--------------------------------------------------
* @desc delete product                          
* @router /api/product/delete/:id                                    
* @method DELETE                          
* @acces Only admin and super admin                         
---------------------------------------------------*/
module.exports.deleteProductsCtrl = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id)//.populate("user",["-password"]);
    if (!product) {
        return res.status(404).json({ message: 'product not fount' })
    }
    // if (req.user.isSuperAdmin || req.user._id === product.user.toString()) {
    await Product.findByIdAndDelete(req.params.id);

    await cloudinaryRemoveImage(product.image.publicId);

    // res.status(200).json(product);
    res.status(200).json({
        message: "post has been deleted successfully",
        productId: product._id
    });
    // } else {
    //     res.status(403).json({
    //         message: "access denied",
    //     }
    //     )
    // }

})




/**--------------------------------------------------
* @desc update product                          
* @router /api/product/:id                                    
* @method PUT                          
* @acces Only admin and super admin                         
---------------------------------------------------*/
module.exports.updateProductsCtrl = asyncHandler(async (req, res) => {
    //validation
    // console.log(req.body)

    const { error } = validateUpdateProduct(req.body);
    //const user = await User.findById(req.params.id).select('-password');
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    // get product from db and check if exist
    // console.log(req.params.id)
    // console.log(req.body)
    const product = await Product.findById(req.params.id);
    if (!product) {
        return res.status(404).json({ message: 'product not found ' })
    }
    //check if this post belong to ligged in user 
    // if (req.user._id !== product.user.toString()) {
    //     return res
    //         .status(403)
    //         .json({ message: "access denied, you are not allowed" });
    // }
    // 4. Update product
    const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        {
            $set: {
                title: req.body.title,
                description: req.body.description,
                price: req.body.price,
                //category: req.body.category,
            },
        },
        { new: true }
    )/*.populate("user", ["-password"])
  .populate("comments");*/

    // 5. Send response to the client

    res.status(200).json(updatedProduct);

})




/**-----------------------------------------------
 * @desc    Update product Image
 * @route   /api/product/upload-image/:id
 * @method  PUT
 * @access  private (only owner of the post)
 ------------------------------------------------*/
module.exports.updateProductImageCtrl = asyncHandler(async (req, res) => {
    // 1. Validation
    if (!req.file) {
        return res.status(400).json({ message: "no image provided" });
    }

    // 2. Get the post from DB and check if post exist
    const product = await Product.findById(req.params.id);
    if (!product) {
        return res.status(404).json({ message: "product not found" });
    }

    // 3. Check if this post belong to logged in user
    if (req.user._id !== product.user.toString()) {
        return res
            .status(403)
            .json({ message: "access denied, you are not allowed" });
    }

    // 4. Delete the old image
    await cloudinaryRemoveImage(product.image.publicId);

    // 5. Upload new photo
    const imagePath = path.join(__dirname, `../images/${req.file.filename}`);
    const result = await cloudinaryUploadImage(imagePath);

    // 6. Update the image field in the db
    const updatedProduct = await Product.findByIdAndUpdate(
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
    res.status(200).json(updatedProduct);

    // 8. Remvoe image from the server
    fs.unlinkSync(imagePath);
});