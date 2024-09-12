// const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const photoUpload = require('../middlewares/photoUpload');
const { verifyToken } = require('../middlewares/verifyToken');
const validateObjectId = require('../middlewares/validateObjectId');
const { createProductCtrl, getAllProductsCtrl, getSingleProductsCtrl, deleteProductsCtrl, updateProductsCtrl, updateProductImageCtrl } = require('../controllers/productController');
const phtoUpload = require('../middlewares/photoUpload');



router.route("/")
    .post(verifyToken, photoUpload.single("image"), createProductCtrl);

router.get("/all", getAllProductsCtrl)
router.get("/:id", validateObjectId, getSingleProductsCtrl)
router.delete("/delete/:id", validateObjectId, verifyToken, deleteProductsCtrl)
router.put("/:id", validateObjectId, verifyToken, updateProductsCtrl)
router.put("/upload-image/:id", validateObjectId, verifyToken, phtoUpload.single("image"), updateProductImageCtrl)



module.exports = router;