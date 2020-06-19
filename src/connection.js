// connection.js
const HOST = process.env.MONGO_HOST || "mongo";
const PORT = process.env.MONGO_PORT || "27017";
const USER = process.env.MONGO_USER || "reporter";
const PASS = process.env.MONGO_PASS || "reporter";
const DATABASE = process.env.MONGO_DATABASE || "reporter";

const mongoose = require("mongoose");
const User = require("./models/Broadcaster.model");
const connection = `mongodb://${USER}:${PASS}@${HOST}:${PORT}/${DATABASE}`;
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
