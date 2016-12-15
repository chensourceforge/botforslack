const http = require('http');
const service = require('../server/service');
const ServiceRegistry = require('../server/serviceRegistry');
const slackClient = require('../server/slack');
const witClient = require('../server/wit');

const slackToken = '';
const witToken = '';

const serviceRegistry = new ServiceRegistry();
const app = service(serviceRegistry);
const server = http.createServer(app);
const rtm = slackClient(slackToken, witClient(witToken), serviceRegistry);

server.listen(3000).on('listening', ()=>{console.log('port:',server.address().port);});

rtm.start();

