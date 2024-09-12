// const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const photoUpload = require('../middlewares/photoUpload');
const { verifyToken } = require('../middlewares/verifyToken');
const validateObjectId = require('../middlewares/validateObjectId');
const { createPartnerCtrl, getAllPartnersCtrl, getSinglePartnerCtrl, deletePartnerCtrl, updatePartnerCtrl, updatePartnerImageCtrl } = require('../controllers/partnerController');
const phtoUpload = require('../middlewares/photoUpload');


router.route("/")
    .post(verifyToken, photoUpload.single("image"), createPartnerCtrl);

router.get("/all", getAllPartnersCtrl)
router.get("/:id", validateObjectId, getSinglePartnerCtrl)
router.delete("/delete/:id", validateObjectId, verifyToken, deletePartnerCtrl)
router.put("/:id", validateObjectId, verifyToken, updatePartnerCtrl)
router.put("/upload-image/:id", validateObjectId, verifyToken, phtoUpload.single("image"), updatePartnerImageCtrl)



module.exports = router;