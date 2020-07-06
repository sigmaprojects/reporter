var express = require('express')

const BroadcasterService = require('../services/Broadcaster.services') ;
const ThermalService = require('../services/Thermals.services') ;

const AllowedTermalTypes = ['generic', 'system', 'cpu', 'drive', 'battery'];

var router = express.Router();

const formidableMiddleware = require('express-formidable');
router.use(formidableMiddleware());

//router.use(bodyParser.json());

// middleware that is specific to this router
router.use(function timeLog (req, res, next) {
    //console.log('Time: ', Date.now())
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

router.get('/search', async (req, res) => {
    Object.assign(req.fields, req.query); // merge the two

    var now = new Date();

    /*
    const termals = await ThermalService.search({
        broadcaster: "5ee6fef97e10b402ba9400f9",
        startDate: now.setDate(now.getDate()-50),
        endDate: now.setDate(now.getDate()+50),
        max: 100,
        offset: 0
    });
    */

    const termals = await ThermalService.search({
        broadcasterid: req.fields.broadcasterid | "5ef8f42d8746412c108fe393",
        type: req.fields.type | "system",
        startDate: req.fields.startDate | now.setDate(now.getDate()-50),
        endDate: req.fields.endDate | now.setDate(now.getDate()+50),
        max: req.fields.max | 100,
        offset: req.fields.offset | 0
    });

   

    return res.status(200).json({ status: 200, data: termals, message: "Sending." });
    
})

router.post('/save', async (req, res) => {
    try {

    Object.assign(req.fields, req.query); // merge the two

    // we need to parse the request and find out if the temps came in through the body (json obj) or query string (?temp=&temp= etc)
    // since this endpoint supports both.  The defining factor is if req.fields has an array of temps and each 
    // index is an object with 2 keys, temp and name

    // if the request contains an array of objects with each having 2 keys
    if( req.fields.temps && Array.isArray(req.fields.temps) ) {
        //console.log('1st good');
        // loop the array once, to see if its an object and the 2 required keys
        for( const elm of req.fields.temps ) {
            //console.log('2nd good');
            // make sure its an object first
            if( typeof elm === 'object' && elm !== null ) {
                //console.log('3rd good');
                if( elm.hasOwnProperty('name') && elm.hasOwnProperty('temp') ) {
                    //console.log('last good');
                    // this is the correct object to use, set it
                    var temps = req.fields.temps;
                }
            } else {
                // for some reason the array doesn't contain objects, maybe just values?
                // if its a number of some kind, its temps
                if( !isNaN(elm) ) {
                    // yep, its a number (or decimal) of some kind, we can use it
                    // but first check if a seperate array of names exist in the request
                    if( req.fields.names && Array.isArray(req.fields.names) ) {
                        // temp names exist!  combine the two
                        var temps = [];
                        for (let i = 0; i < req.fields.temps.length; i++) {
                            temps.push({
                                name: req.fields.names[i],
                                temp: req.fields.temps[i]
                            });
                        }
                        //console.log('names ', req.fields.names);
                    } else {
                        // no, so just mock up some temps with names as the index / order they came in as
                        var temps = [];
                        for (let i = 0; i < req.fields.temps.length; i++) {
                            temps.push({
                                name: i,
                                temp: req.fields.temps[i]
                            });
                        }
                    }
                }
            }
            break; // we're done, break out
        }
    }

    // by now we should have an array named temps, if not return an error and exit
    if( !temps ) {
        return res.status(500).json({ status: 500, data: {}, message: "Could not locate temps array in request" });
    }

    // get a reference to the broadcaster, this can be an id, by name, etc
    const broadcaster = await BroadcasterService.findOrCreateBroadcasterByRequest( req );

    // the thermal type, cpu, hard drives, battery, etc - see AllowedTermalTypes
    const type = (req.fields.type === undefined) ? 'generic' : req.fields.type;

    // a thermal type must be defined and allowed
    if( !AllowedTermalTypes.includes( type.toString().toLowerCase() ) ) {
        return res.status(500).json({ status: 500, data: {'AllowedTermalTypes':AllowedTermalTypes}, message: "Requested Thermal Type is Unsupported: " + type });
    }


    // okay we made it this far, we can save the thermals request
    const termal = await ThermalService.create({
        broadcaster: broadcaster,
        type: type,
        temps: temps,
        zipcode: req.fields.zipcode
    });

    return res.status(200).json({ status: 200, data: termal, message: "Successfully saved thermals." });

    } catch(err) {
        console.error('Unexpected Error in Thermals.js handler', err);
        return res.status(500).json({ status: 503, data: err.toString(), message: "Unexpected Error in Thermals.js handler" });
    }

})

// define the home page route
router.get('/', async (req, res) => {
    res.send('thermals home page')
})


module.exports = router