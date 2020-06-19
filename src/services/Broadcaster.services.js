const Broadcaster = require('../models/Broadcaster.model');

exports.getById = async function (id) {
    try {
        const broadcaster = await Broadcaster.findById(id);
        return broadcaster;
    } catch (e) {
        // Log Errors
        console.e(e);
    }
}

exports.getOrCreateByName = async function (name, description) {
    const b = await Broadcaster.findOne({ name: name });
    if( b ) {
        return b;
    }
    const nb = new Broadcaster({ name: name, description: description });
    return await nb.save().then(() => nb);
}

exports.findOrCreateBroadcasterByRequest = async function(req) {
    if( req.fields && req.fields.broadcasterId ) {
        return await module.exports.getById( req.fields.broadcasterId );
    }

    if( req.query && req.query.broadcasterId ) {
        return await module.exports.getById( req.query.broadcasterId );
    }

    if( req.fields && req.fields.name ) {
        return await module.exports.getOrCreateByName( req.fields.name, req.fields.description );
    }

    if( req.query && req.query.name ) {
        return await module.exports.getOrCreateByName( req.query.name, req.query.description );
    }
    return null;
}