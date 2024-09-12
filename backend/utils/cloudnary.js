const cloudinary = require('cloudinary');
require('dotenv').config({ path: '.env' })

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// cloudnary upload image 
const cloudinaryUploadImage = async (fileToUpload) => {
    try {
        const data = await cloudinary.uploader.upload(fileToUpload, {
            resource_type: 'auto',
        });
        return data;
    } catch (error) {
        throw new Error("Internal Server Error (cloudnary)")
    }
}

// cloudnary remove image 
const cloudinaryRemoveImage = async (imagePublicId) => {
    try {
        const result = await cloudinary.uploader.destroy(imagePublicId)
        if (result.result !== 'ok') {
            throw new Error('Failed to delete image');
        }
        return result;
    } catch (error) {
        throw new Error("Internal Server Error (cloudnary)")
    }
}

module.exports = {
    cloudinaryUploadImage,
    cloudinaryRemoveImage
}