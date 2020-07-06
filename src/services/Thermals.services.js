const Thermals = require('../models/Thermals.model');

const weather = require('openweather-apis');

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

/**
   * @param {string} broadcasterid
   * @param {Date} startDate
   * @param {Date} endDate
   * @param {number} max
   * @param {number} offset
   */ 
  exports.search = async function({broadcasterid, startDate, endDate, max = 100, offset = 0, type = 'system'}) {

    //const thermals =
    return await Thermals.find({
        broadcasterid: broadcasterid,
        created: { $gte: startDate },
        created: { $lte: endDate },
        type: type
    })
        .sort({ created: 'desc' })
        .skip(offset) //Notice here
        .limit(max)
    ;

    //return await thermal;
    //return await thermals;
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
