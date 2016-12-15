const express = require('express');
const bodyParser = require('body-parser');
const service = express();

let serviceRegistry;

service.use(bodyParser.json());
service.use(bodyParser.urlencoded({ extended: false }));

service.get('/service/:intent', getService);
service.put('/service/:intent/:port', addService);
service.delete('/service/:intent', removeService);

function getService(req, res){
    let intent = req.params.intent;
    res.json(serviceRegistry.get(intent));
}

function addService(req, res){
    let intent = req.params.intent;
    let ip = req.connection.remoteAddress.match(/\d+\.\d+\.\d+\.\d+/)[0];
    let port = req.params.port;
    serviceRegistry.add(intent, ip, port);
    res.json({result: `registered ${intent} at ${ip}:${port}`});
}

function removeService(req, res){
    let intent = req.params.intent;
    serviceRegistry.remove(intent);
    res.json({result: `removed ${intent}`});
}

module.exports = (registry) => {
    serviceRegistry = registry;
    return service;
};