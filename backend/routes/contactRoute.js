// const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const { verifyToken, verifyTokenAndSuperAdmin } = require('../middlewares/verifyToken');
const validateObjectId = require('../middlewares/validateObjectId');
const { createContactCtrl, getAllContactsCtrl, getSingleContactCtrl, deleteContactCtrl } = require('../controllers/contactController');



router.post("/", createContactCtrl);
router.get("/all", getAllContactsCtrl)
router.get("/:id", verifyToken, validateObjectId, verifyTokenAndSuperAdmin, getSingleContactCtrl)
router.delete("/delete/:id", validateObjectId, verifyTokenAndSuperAdmin, deleteContactCtrl)



module.exports = router;