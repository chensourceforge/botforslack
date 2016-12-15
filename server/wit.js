const Wit = require('node-wit').Wit;

function onWitData({entities}){
    return entities;
}


module.exports = (token) => {
    const client = new Wit({accessToken: token});
    return {
        ask: (sentence) => {
            if(sentence.length < 1){
                return Promise.resolve(false);
            }
            return client.message(sentence, {}).then(onWitData);
        }
    };
};
