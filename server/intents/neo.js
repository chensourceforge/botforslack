const request = require('superagent');
const plotly = require('../plotly.js');
const cloudinary = require('../cloudinary');

const intent = 'neo';

function getStuffFromOtherServer(entities, serviceRegistry){
    return new Promise((resolve, reject) => {
        let service = serviceRegistry.get(intent);
        if(!service) { return reject(); }
        let ip = service.ip;
        let port = service.port;
        request.
            post(`${ip}:${port}/service/${intent}`).
            send(entities).
            end((err, res) => {
                if(err) { return reject(err); }
                return resolve(res.body);
            });
    });
}

function parseIt(neo){
    let traces = [];
    for(let day of neo.days){
        let trace = {};
        trace.x = [];
        trace.y = [];
        trace.mode = "markers";
        trace.marker = {};
        trace.marker.color = [];
        trace.marker.size = [];
        trace.type = "scatter";
        for(let asteroid of day.asteroids){
            trace.x.push(asteroid.miss_distance / 1000000);
            trace.y.push(asteroid.kilometers_per_hour / 10000);
            trace.marker.color.push(asteroid.hazardous ? "red" : "green");
            trace.marker.size.push(Math.log((asteroid.diameter_min + asteroid.diameter_max) / 2 * 1000) * 4);
        }
        traces.push(trace);
    }

    return plotly(neo.count, traces).
        then( (imageStream) => {
            return new Promise((resolve, reject)=>{
                imageStream.pipe(cloudinary.uploader.upload_stream((uploadedImage)=>{
                    return resolve(uploadedImage.url);
                }));
            });
        });

}

function process(entities, serviceRegistry){
    return getStuffFromOtherServer(entities, serviceRegistry).then(parseIt);
}

module.exports = process;
