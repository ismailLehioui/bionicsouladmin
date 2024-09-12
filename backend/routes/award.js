// const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const photoUpload = require('../middlewares/photoUpload');
const { verifyToken } = require('../middlewares/verifyToken');
const validateObjectId = require('../middlewares/validateObjectId');
const { createAwardCtrl, getAllAwardsCtrl, getSingleAwardsCtrl, deleteAwardsCtrl, updateAwardsCtrl, updateAwardImageCtrl } = require('../controllers/awardController');
const phtoUpload = require('../middlewares/photoUpload');



router.route("/")
    .post( photoUpload.single("image"), createAwardCtrl);

router.get("/all", getAllAwardsCtrl)
router.get("/:id", validateObjectId, getSingleAwardsCtrl)
router.delete("/delete/:id", validateObjectId, verifyToken, deleteAwardsCtrl)
router.put("/:id", validateObjectId, verifyToken, updateAwardsCtrl)
router.put("/upload-image/:id", validateObjectId, verifyToken, phtoUpload.single("image"), updateAwardImageCtrl)



module.exports = router;