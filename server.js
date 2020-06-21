// openweather api key dde2fe1be622c8ef2b67a592b13b6e24
// https://blog.jscrambler.com/build-a-task-management-app-using-vue-js-and-a-node-js-backend/
const PORT = process.env.PORT || 8080;

const express = require('express');
const app = express();
const cors = require('cors');

const connectDb = require('./src/connection');

const ThermalsRoute = require('./src/routes/thermals');

const BroadcastersRoute = require('./src/routes/broadcasters');

process.on('uncaughtException', (error)  => {
    console.log('Oh my god, something terrible happend: ',  error);
    //process.exit(1); // exit application 
});
process.on('unhandledRejection', (error, promise) => {
    console.log(' Oh Lord! We forgot to handle a promise rejection here: ', promise);
    console.log(' The error was: ', error );
});

// enable ALL cors requsts
app.use(cors())

app.use('/thermals', ThermalsRoute);

app.use('/broadcasters', BroadcastersRoute);

app.get('/', (req, res) => {
    res.send('Hello from App Engine!!!');
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