const jwt = require('jsonwebtoken');


//veridy token 

function verifyToken(req, res, next) {
    const authToken = req.headers.authorization;
    if (authToken) {
        const token = authToken.split(" ")[1];
        try {
            const decodedPayload = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decodedPayload;
            // console.log(req.user)
            // console.log(req)
            /*console.log(decodedPayload);==>   {
                                                    _id: '667b7015b55ac13e8474547f',
                                                    isSuperAdmin: true,
                                                    iat: 1719365674
                                                }*/
            next();
        } catch (err) {
            /*console.log(decodedPayload);==>  { _id: '667b6ea2c6a41cd13fb3c53d', iat: 1719365352 }*/
            return res.status(401).json({ message: "Invalid token , acces denied" })
        }
    } else {
        res.status(401).json({ message: "no token provided, acces denied" });
    }
}

//verify token & super admin

function verifyTokenAndSuperAdmin(req, res, next) {
    verifyToken(req, res, () => {
        if (req.user.isSuperAdmin) {
            next();
        } else {
            return res.status(403).json({ message: "you are not super admin , acces denied" });
        }
    })
}

//verify token & Only user himself

function verifyTokenAndOnlyUser(req, res, next) {
    verifyToken(req, res, () => {
        if (req.user._id === req.params.id) {
            next();
        } else {
            return res.status(403).json({ message: "not allowed, Only user himself" });
        }
    });
}



module.exports = {
    verifyToken,
    verifyTokenAndSuperAdmin,
    verifyTokenAndOnlyUser
}