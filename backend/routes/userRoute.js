const express = require('express');

const router = express.Router();

const { getAllUsersCtrl, getUserCtrl, updateUserProfileCtrl, profilePhotoUploadCtrl } = require('../controllers/usersController');

const validateObjectId = require("../middlewares/validateObjectId")

const { verifyTokenAndSuperAdmin, verifyTokenAndOnlyUser } = require('../middlewares/verifyToken');
const phtoUpload = require('../middlewares/photoUpload');


router.get('/all', verifyTokenAndSuperAdmin, getAllUsersCtrl);
router.get('/profile/:id', validateObjectId, getUserCtrl)
router.put(
    '/update/:id',
    validateObjectId,
    verifyTokenAndOnlyUser,
    updateUserProfileCtrl
);
router.post(
    '/profile/profile-photo-upload/:id'  , verifyTokenAndOnlyUser,
    phtoUpload.single("image"),
    profilePhotoUploadCtrl
);



module.exports = router;







// let filename = '';
// const myStorage = multer.diskStorage({

//     destination: './uploads',
//     filename: (req, file, redirect) => {

//         let date = Date.now();

//         let f1 = date + '.' + file.mimetype.split('/')[1]
//         redirect(null, f1);
//         filename = f1;
//     }
// })

// const upload = multer({ storage: myStorage })





// router.post('/register', upload.any('image'), (req, res) => {

//     let data = req.body;
//     let author = new Author(data);
//     author.image = filename;
//     let salt = bcrypt.genSaltSync(10);
//     author.password = bcrypt.hashSync(data.password, salt)

//     author.save()
//         .then(
//             (savedAuthor) => {
//                 filename = '';
//                 res.status(200).send(savedAuthor);
//             })
//         .catch(
//             (err) => {
//                 res.send()
//             }
//         )
// })



// router.post('/login', (req, res) => {

//     let data = req.body;

//     if (!data || !data.email || !data.password) {
//         res.status(400).send('Invalid request. Make sure to provide email and password.');
//         return;
//     }

//     Author.findOne({ email: data.email })
//         .then(
//             (author) => {
//                 let valid = bcrypt.compareSync(data.password, author.password);
//                 if (!valid) {
//                     res.send('email or password invalid');
//                 } else {

//                     let payload = {
//                         _id: author._id,
//                         email: author.email,
//                         fullname: author.name + ' ' + author.lastname
//                     }
//                     //-------------------------------bard----------------------------------------


//                     const crypto = require('crypto');
//                     const secret = crypto.randomBytes(32).toString('hex');
//                     const token = jwt.sign(payload, secret);

//                     res.send({ mytoken: token });



//                 }

//             }
//         )
// })



// router.get('/all', (req, res) => {

//     let id = req.params.id;

//     Author.find({})
//         .then(
//             (authors) => {
//                 res.status(200).send(authors);
//             }
//         )
//         .catch(
//             (err) => {
//                 res.status(400).send(err);
//             }
//         )

// })



// router.get('/getbyid/:id', (req, res) => {

//     let id = req.params.id;

//     Author.findOne({ _id: id })
//         .then(
//             (authors) => {
//                 res.status(200).send(authors);
//             }
//         )
//         .catch(
//             (err) => {
//                 res.status(400).send(err);
//             }
//         )
// })



// router.delete('/supprimer/:id', (req, res) => {

//     let id = req.params.id;
//     Author.findByIdAndDelete({ _id: id })
//         .then(
//             (authors) => {
//                 res.status(200).send(authors);
//             }
//         )
//         .catch(
//             (err) => {
//                 res.status(400).send(err);
//             }
//         )
// })



// router.put('/update/:id', (req, res) => {

//     //à faire à la maison hhhhh
//     //optionnelle
// })






// module.exports = router;