var _ = require('underscore');

var animationsArray = ['bounce', 'flash', 'pulse', 'rubberBand', 'shake', 'swing', 'tada', 'wobble', 'bounceIn',
   'bounceInDown', 'bounceInLeft', 'bounceInRight', 'bounceInUp', 'fadeIn', 'fadeInDown',
   'fadeInDownBig', 'fadeInLeft', 'fadeInLeftBig', 'fadeInRight', 'fadeInRightBig', 'fadeInUp',
   'fadeInUpBig', 'flip', 'flipInX', 'flipInY', 'lightSpeedIn', 'rotateIn',
   'rotateInDownLeft', 'rotateInDownRight', 'rotateInUpLeft', 'rotateInUpRight', 'slideInDown',
   'slideInLeft', 'slideInRight', 'rollIn'];

function getAnimations() {
   var ret = [];
   for(var i = 0; i < 9; i++)
   {
      ret.push(animationsArray[Math.floor(Math.random() * (animationsArray.length))]);
   }
   return ret.toString();
}

exports.index = function (req, res, http) {

   var options = {
      host: 'api.wunderground.com',
      port: 80,
      path: '/api/ca7fac1777f1cb6f/forecast/q/' + req.params.countryCd + '/' + req.params.city + '.json',
      method: 'GET'
   };

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

         var city = req.params.city.substring(0, 1).toUpperCase() + req.params.city.substring(1).toLowerCase();
         var country = req.params.countryCd.toUpperCase();

         var finalJson = _.extend(jsonBuffer, { country: country, city: city, title: 'NodeJS Weather Watcher', animationsArray: getAnimations() });

         res.render('index', finalJson);
      });
   }).end();
};