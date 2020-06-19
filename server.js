// openweather api key dde2fe1be622c8ef2b67a592b13b6e24
const express = require('express');
const app = express();

const connectDb = require('./src/connection');
const Broadcaster = require('./src/models/Broadcaster.model');

const BroadcasterService = require('./src/services/Broadcaster.services') ;

const ThermalsRoute = require('./src/routes/thermals');

process.on('uncaughtException', (error)  => {
    console.log('Oh my god, something terrible happend: ',  error);
    //process.exit(1); // exit application 
});
process.on('unhandledRejection', (error, promise) => {
    console.log(' Oh Lord! We forgot to handle a promise rejection here: ', promise);
    console.log(' The error was: ', error );
});

app.use('/thermals', ThermalsRoute);

app.get('/', (req, res) => {
    res.send('Hello from App Engine!!!');
});

app.get('/broadcasters', async (req, res) => {
    try {
        const broadcasters = await Broadcaster.find();
        res.json(broadcasters);
    } catch(e) {
        console.error(e);
    }
});

//app.all to listen for all verbs at an endpoint
//.all can be used for validation and stuff as a pre handler!

app.get("/user-create", async (req, res) => {
    console.log('body, ', req.body);
    console.log('params, ', req.params);
    console.log('query, ', req.query);
    const bc = new Broadcaster({ name: "tes2343t2" });
    await bc.save().then(() => console.log("bc created"));
    res.send("bc created \n " + req );
});

app.all('/all', async (req, res, next) => {
    try {
        var broadcaster = await BroadcasterService.getOrCreateByName( req.query.name );
        return res.status(200).json({ status: 200, data: broadcaster, message: "Succesfully Broadcaster Retrieved" });
    } catch (e) {
        return res.status(500).json({ status: 500, message: e.message });
    }
});

// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});

connectDb().then(() => {
    console.log("MongoDb connected");
});

process.on('SIGINT', () => {
    /*
    connectDb.close(() => {
        logger.info('Mongoose disconnected on app termination');
    });
    */
});