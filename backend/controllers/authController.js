const { User, validateRegisterUser, validateLoginUser } = require('../models/user');
const asyncHandler = require("express-async-handler")
const bcrypt = require('bcrypt');


/**--------------------------------------------------
* @desc Create Super Admin
* @router /api/user/create-superadmin
* @method POST
* @access Public
---------------------------------------------------*/
// router.post('/create-superadmin', asyncHandler(async (req, res) => {
//   const { error } = validateRegisterUser(req.body);
//   if (error) return res.status(400).json({ message: error.details[0].message });

//   const { name, lastname, email, password } = req.body;

//   // Vérifiez s'il existe déjà un super admin
//   const existingSuperAdmin = await User.findOne({ isSuperAdmin: true });
//   if (existingSuperAdmin) {
//     return res.status(403).json({ message: 'SuperAdmin already exists' });
//   }

//   // Créez un nouveau super admin
//   const hashedPassword = await bcrypt.hash(password, 10);
//   const superAdmin = new User({
//     name,
//     lastname,
//     email,
//     password: hashedPassword,
//     isSuperAdmin: true
//   });

//   await superAdmin.save();
//   res.status(201).json({ message: 'SuperAdmin created successfully', superAdmin });
// }));

// module.exports = router;


/**--------------------------------------------------
* @desc New User
* @router /auth/register 
* @method POST
* @acces public 
---------------------------------------------------*/
module.exports.registerUserCtrl = asyncHandler(async (req, res) => {
    //validation
    const { error } = validateRegisterUser(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message })
    }
    // Vérifier si un utilisateur existe déjà
    const existingUserCount = await User.countDocuments({});
    if (existingUserCount >= 1) {
        return res.status(403).json({ message: "You cannot create an account this time" });
    }
    //is exist
    let user = await User.findOne({ email: req.body.email });
    if (user) {
        return res.status(400).json({ message: "user already exist" });
    }
    //hash the password 
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    //new user
    user = new User({
        name: req.body.name,
        // lastname: req.body.lastname,
        email: req.body.email,
        password: hashedPassword
    })
    //@TODO  - sending email( verify account if not verified )


    //send a password to client
    await user.save();
    res.status(201).json({
        message: "you registred succefull ! please login"
    });
})





/*--------------------------------------------------
* @desc Login User
* @router /auth/login 
* @method POST
* @acces public 
---------------------------------------------------*/
module.exports.loginUserCtrl = asyncHandler(async (req, res) => {
    //validation 
    const { error } = validateLoginUser(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message })
    }
    //is user exist
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return res.status(400).json({ message: "Invalid email or password" })
    }
    //check the password
    const isPasswordMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isPasswordMatch) {
        return res.status(400).json({ message: "Invalid email or password" })
    }
    //@TODO  - sending email( verify account if not verified )

    //generate token 
    const token = user.generateAuthToken();
    //response to client
    res.status(200).json({
        _id: user._id,
        name: user.name,
        isSuperAdmin: user.isSuperAdmin,
        profilePhoto: user.profilePhoto,
        token,
    })
})