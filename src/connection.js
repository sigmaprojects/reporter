// connection.js
const mongoose = require("mongoose");
const User = require("./models/Broadcaster.model");
const connection = "mongodb://reporter:reporter@mongo:27017/admin";
const connectDb = () => {

    const opts = {
        keepAlive: true,
        //keepAliveInitialDelay: 300000,
        //socketTimeoutMS: 30000,
        //poolSize: 50,
        useNewUrlParser: true,
        useUnifiedTopology: true
    };

    return mongoose.connect(
        connection,
        opts
    );
};
module.exports = connectDb;