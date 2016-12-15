const username = '';
const token = '';
const plotly = require('plotly')(username, token);

function getImage(count, traces){
    let data = traces;
    let layout = {
        title: 'Asteroids count: ' + count, 
        xaxis: {title: 'miss distance (1,000,000 km)'}, 
        yaxis: {title: 'speed (10,000 km/h)'}, 
        showlegend: false};
    let figure = { 'data': data, 'layout': layout };
    let imgOpts = {
        format: 'png',
        width: 900,
        height: 700
    };

    return new Promise((resolve, reject) => {
        plotly.getImage(figure, imgOpts, function (error, imageStream) {
            if (error) { return reject(error); }
            return resolve(imageStream);
        });
    });
}

module.exports = getImage;

