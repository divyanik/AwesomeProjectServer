    const mongoose = require('mongoose');

    require('dotenv').config();

    //console.log(process.env.mongo_URL, process.env.jwt_sercet);

    mongoose.connect(process.env.mongo_URL).then(
        () => {
            console.log('Database connected..');
        }
    )
    .catch((exp) => {
        console.log('Database connection failed!!')
    });