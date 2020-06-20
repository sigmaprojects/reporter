// openweather api key dde2fe1be622c8ef2b67a592b13b6e24
const PORT = process.env.PORT || 8080;

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


// Listen to the App Engine-specified port, or 8080 otherwise

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