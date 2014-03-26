var _ = require('underscore');

// list of "in" animations from animate.css
var animationsArray = ['bounce', 'flash', 'pulse', 'rubberBand', 'shake', 'swing', 'tada', 'wobble', 'bounceIn',
   'bounceInDown', 'bounceInLeft', 'bounceInRight', 'bounceInUp', 'fadeIn', 'fadeInDown',
   'fadeInDownBig', 'fadeInLeft', 'fadeInLeftBig', 'fadeInRight', 'fadeInRightBig', 'fadeInUp',
   'fadeInUpBig', 'flip', 'flipInX', 'flipInY', 'lightSpeedIn', 'rotateIn',
   'rotateInDownLeft', 'rotateInDownRight', 'rotateInUpLeft', 'rotateInUpRight', 'slideInDown',
   'slideInLeft', 'slideInRight', 'rollIn'];

// gets 9 random animations from the array to apply on different parts of the page
function getAnimations() {
   var ret = [];
   for(var i = 0; i < 5; i++) {
      ret.push(animationsArray[Math.floor(Math.random() * (animationsArray.length))]);
   }
   return ret.toString();
}

// the module export
exports.index = function (req, res, http) {
   
   // options for accessing the Wunderground api
   var options = {
      host: 'api.wunderground.com',
      port: 80,
      path: '/api/ca7fac1777f1cb6f/forecast/q/' + req.params.countryCd + '/' + req.params.city + '.json',
      method: 'GET'
   };

   // makes the request
   http.request(options, function (httpResponse) {
      console.log('STATUS: ' + httpResponse.statusCode);
      console.log('HEADERS: ' + JSON.stringify(httpResponse.headers));
      httpResponse.setEncoding('utf8');

      var buffer = '';

      // the data event is triggered for every network package received so we need to append to get the full result
      httpResponse.on('data', function (chunk) {
         buffer += chunk;
      });

      httpResponse.on('error', function (err) {
         console.log('ERROR: ' + err);
      });

      // in the end, render the view passing it the result data
      httpResponse.on('end', function () {
         var jsonBuffer = JSON.parse(buffer);

         var city = req.params.city.substring(0, 1).toUpperCase() + req.params.city.substring(1).toLowerCase();
         var country = req.params.countryCd.toUpperCase();

         var finalJson = _.extend(jsonBuffer, { country: country, city: city, title: 'NodeJS Weather Watcher', animationsArray: getAnimations() });

         res.render('index', finalJson);
      });
   }).end();
};