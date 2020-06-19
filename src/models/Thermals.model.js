// Temp.model.js
// https://itnext.io/dockerize-a-node-js-app-connected-to-mongodb-64fdeca94797
// https://zellwk.com/blog/mongoose-subdocuments/
// mongoose.Decimal128
const mongoose = require("mongoose");

const thermalsSchema = new mongoose.Schema({
    broadcaster: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Broadcaster"
    },
    'type': String, // losely defined types like "drive" "cpu" "battery", etc - maybe make this hard-defined
    temps: [{
        name: String,
        temp: Number
    }],
    humidity: Number, // can be sent manually
    weather_humidity: Number,
    weather_temp: Number, // generic area based temp
    created: { type: Date, default: Date.now }
});
const Thermals = mongoose.model("Thermals", thermalsSchema);
module.exports = Thermals;