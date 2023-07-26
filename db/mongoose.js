const mongoose = require('mongoose');
// // const validator = require('validator');

const dbUrl = process.env.PORT ? process.env.ONLINE_MONGODB_URL : process.env.MONGODB_URL;

mongoose.set('strictQuery', true);
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
//     useCreateIndex: true,
//     useUnifiedTopology: true,
//     useFindAndModify: false
});

