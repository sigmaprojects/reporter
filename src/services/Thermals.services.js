const Thermals = require('../models/Thermals.model');

const weather = require('openweather-apis');
//const e = require('express');
const util = require('util');

/**
   * @param {<Broadcaster>} broadcaster
   * @param {string} type
   * @param {Array<Temps>} temps
   * @param {decimal} humidity
   * @param {number} zipcode
   * @return {<Thermal>}
   */ 
exports.create = async function({broadcaster, type, temps, humidity, zipcode = '-'}) {
    if( !isNaN(zipcode) ) {
        weather.setZipCode( zipcode );
        weather.setAPPID('dde2fe1be622c8ef2b67a592b13b6e24');

        const getSmartJSON = util.promisify(weather.getSmartJSON);

        const weatherData = await getSmartJSON()
            .then(data => { return data; })
            .catch(err => { console.log('getSmartJSON error'); console.error(err) });
        //console.log('weatherData ', weatherData);

        var weather_humidity = weatherData.humidity;
        var weather_temp = weatherData.temp;
    } else {
        var weather_humidity = null;
        var weather_temp = null;
    }
    
    const thermal = new Thermals({
        broadcaster: broadcaster,
        type: type,
        temps: temps,
        humidity: humidity || undefined,
        weather_humidity: weather_humidity || undefined,
        weather_temp: weather_temp || undefined
    });

    //return await thermal;
    return await thermal.save().then(() => thermal);
}

exports._notdefined = async function (id) {
    try {
        const thermals = await Thermals.findById(id);
        return thermals;
    } catch (e) {
        // Log Errors
        console.e(e);
    }
}
