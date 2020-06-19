// Broadcaster.model.js
// https://itnext.io/dockerize-a-node-js-app-connected-to-mongodb-64fdeca94797
const mongoose = require("mongoose");
const broadcasterSchema = new mongoose.Schema({
    name: String,
    description: String,
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now }
});
const Broadcaster = mongoose.model("Broadcaster", broadcasterSchema);
module.exports = Broadcaster;