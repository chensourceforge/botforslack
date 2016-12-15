const request = require('superagent');

const intent = 'mars';

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
                if(err) return reject(err);
                return resolve(res.body);
            });
    });
}

function parseIt(mars){
    let count = mars.length;
    if(count > 0){
        let output = "`" + count + " photos on " + mars[0].earth_date + "`";
        for(let pic of mars){
            output += "\n> *" + pic.camera + "*";
            output += "\n> " + pic.img_src;
        }
        return output;
    } else {
        return "`no pictures`";
    }
}

function process(entities, serviceRegistry){
    return getStuffFromOtherServer(entities, serviceRegistry).then(parseIt);
}

module.exports = process;
