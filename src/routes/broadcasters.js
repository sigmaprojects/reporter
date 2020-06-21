var router = require('express').Router()

const Broadcaster = require('../models/Broadcaster.model');

const formidableMiddleware = require('express-formidable');
router.use(formidableMiddleware());


// middleware that is specific to this router
router.use(function timeLog (req, res, next) {
    // make the lookups case insensitive 
    if( req.fields ) {
        req.fields = new Proxy(req.fields, {
            get: (target, name) => target[Object.keys(target)
                .find(key => key.toLowerCase() === name.toLowerCase())]
        })
    }
    if( req.query ) {
        req.query = new Proxy(req.query, {
            get: (target, name) => target[Object.keys(target)
                .find(key => key.toLowerCase() === name.toLowerCase())]
        })
    }
    next()
})

router.get('/list', async (req, res) => {
    Object.assign(req.fields, req.query); // merge the two

    var broadcasters = [];

    try {
        broadcasters = await Broadcaster.find();
    } catch(err) {
        console.error('Unexpected Error in Broadcasters.js handler', err);
        return res.status(500).json({ status: 503, data: err.toString(), message: "Unexpected Error in Broadcasters.js handler" });
    }

    return res.status(200).json({ status: 200, data: broadcasters, message: "Sending." });
    
})


// define the home page route
router.get('/', async (req, res) => {
    res.send('broadcaster home page')
})


module.exports = router