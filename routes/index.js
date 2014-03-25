var _ = require('underscore');

exports.index = function (req, res, http) {

    var options = {
        host: 'api.wunderground.com',
        port: 80,
        path: '/api/ca7fac1777f1cb6f/forecast/q/' + req.params.countryCd + '/' + req.params.city + '.json',
        method: 'GET'
    };

    var ret;

    http.request(options, function (httpResponse) {
        console.log('STATUS: ' + httpResponse.statusCode);
        console.log('HEADERS: ' + JSON.stringify(httpResponse.headers));
        httpResponse.setEncoding('utf8');

        var buffer = '';

        httpResponse.on('data', function (chunk) {
            buffer += chunk;
        });

        httpResponse.on('error', function (err) {
            console.log('ERROR: ' + err);
        });
        
        httpResponse.on('end', function () {
            var jsonBuffer = JSON.parse(buffer);
            
            var finalJson = _.extend(jsonBuffer, { country: req.params.countryCd, city: req.params.city, title: 'NodeJS Weather Watcher' });

            res.render('index', finalJson);
        });
    }).end();
};