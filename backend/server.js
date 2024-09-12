const express = require('express');
const productApi = require('./routes/productRoute');
const userApi = require('./routes/userRoute');
const authorApi = require('./routes/authRuote');
const partnerApi = require('./routes/partnerRoute')
const contactApi = require('./routes/contactRoute')
const achievementApi = require('./routes/award')
const cors = require('cors');
const { errorHandler, notFound } = require('./middlewares/error');
const { default: helmet } = require('helmet');
const hpp = require('hpp')
const xss = require('xss-clean')
require('dotenv').config({ path: '../.env' })
require('./config/connect');
const path = require('path');



const app = express();
// security header (helmet)
// app.use(
//     helmet.contentSecurityPolicy({
//         directives: {
//             defaultSrc: ["'self'"],
//             scriptSrc: [
//                 "'self'",
//                 "https://use.fontawesome.com",
//                 "https://code.jquery.com",
//                 "https://cdnjs.cloudflare.com",
//                 "https://cdn.jsdelivr.net",
//                 "https://www.google.com"
//             ],
//             // Ajoutez d'autres directives nécessaires ici
//         }
//     })
// );
// //prevent http params pollution
// app.use(hpp())
// //prevent xss (Cross Site Scripting) attack
// app.use(xss())


app.use(cors({
    origin: ["http://localhost:3000", "http://localhost:3001", "http://www.bionicsoul.net", "https://www.bionicsoul.net"],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));


app.use(express.json());


app.use('/api/auth', authorApi);
app.use('/api/users', userApi);
app.use('/api/product', productApi);
app.use('/api/partner', partnerApi);
app.use('/api/contact', contactApi);
app.use('/api/award', achievementApi)

// if (process.env.NODE_ENV === "production") {
//     // Servir les fichiers statiques de adminfrontend à la racine
//     app.use(express.static(path.join(__dirname, "adminfrontend", "build")));

//     // Serveur des fichiers statiques de adminadminfrontend pour /admin
//     app.use('/admin', express.static(path.join(__dirname, "adminadminfrontend", "build")));

//     // Gérer les routes pour adminfrontend (root route)
//     app.get('*', (req, res, next) => {
//         if (req.originalUrl.startsWith('/admin')) {
//             // Pour les requêtes qui commencent par /admin, servir adminadminfrontend
//             res.sendFile(path.join(__dirname, "adminadminfrontend", "build", "index.html"));
//         } else {
//             // Pour toutes les autres requêtes, servir adminfrontend
//             res.sendFile(path.join(__dirname, "adminfrontend", "build", "index.html"));
//         }
//     });
// }


if (process.env.NODE_ENV === 'production') {
    // Serve les fichiers statiques du build React
    app.use(express.static(path.join(__dirname, 'adminfrontend/build')));

    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'adminfrontend/build', 'index.html'));
    });
}

//error handler liddmeware
app.use(notFound);
app.use(errorHandler)



const part = process.env.PORT || 5000;


app.listen(part, () => {
    console.log(`server works on port ${part}`);
})


