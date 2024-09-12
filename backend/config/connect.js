const mongoose = require('mongoose');

// mongoose.connect(process.env.MONGO_URI)

mongoose.connect(process.env.MONGO_CLOUD_URI)
    .then(
        () => {
            console.log('MongoDB connected');
        }
    )
    .catch(
        (err) => {
            console.log(err);
        }
    )

module.exports = mongoose;