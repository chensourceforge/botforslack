const RtmClient = require("@slack/client").RtmClient;
const CLIENT_EVENTS = require("@slack/client").CLIENT_EVENTS;
const RTM_EVENTS = require("@slack/client").RTM_EVENTS;

const neo = require("./intents/neo.js");
const mars = require("./intents/mars.js");

let rtm;
let nlp;
let serviceRegistry;

let myId, myName;
let myMention;


function onMessage(message){

    if(message.subtype){return;}

    let channel = message.channel;
    let user = message.user;
    let text = message.text;

    if(!user || !text){return;}
    if(user == myId){return;}

    if(!myMention.test(text)){return;}

    let query = text.replace(myMention, '');
    // call wit.ai

    nlp.ask(query).
    then(getStuff).
    then((stuff)=>{
        rtm.sendMessage(`<@${user}> ${stuff}`, channel);
    }).
    catch((error) => {
        rtm.sendMessage(`<@${user}> Sorry, I don't understand that.`, channel);
    });
}

function getStuff(entities) {
    if(!entities || !entities.intent || 
        !entities.intent[0] || !entities.intent[0].value){
        return Promise.reject();
    }

    let intent = entities.intent[0].value;
    switch(intent){
        case 'greetings': return 'Greetings!';
        case 'neo': return neo(entities, serviceRegistry);
        case 'mars': return mars(entities, serviceRegistry);
        default: return Promise.reject();
    }
};

function onAuthenticated(rtmStartData){
    myId = rtmStartData.self.id;
    myName = rtmStartData.self.name;
    myMention = new RegExp(myName + '|<@' + myId + '>', 'gi');
}

module.exports = (token, wit, registry) => {
    rtm = new RtmClient(token);
    nlp = wit;
    serviceRegistry = registry;
    rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, onAuthenticated);
    rtm.on(RTM_EVENTS.MESSAGE, onMessage);
    return rtm;
};

