var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , url = require('url');

var app = express();

//   app.use(express.static(path.join(__dirname, 'public')));



app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.static(__dirname + "/public"));


// some middleware
app.all("*", function(req, res, next) {
  if (req.params && req.params.city) {
      console.log(req.params.city);
      req.params.city = req.params.city.replace('%20', '_');
   }
  next();
});

// handle home route
app.get('/', function (req, res) {
   res.render('index');
});

// handle one param route
app.get('/:countryCd', function (req, res) {
   res.render('index');
});

// handle two params route
app.get('/:countryCd/:city', function (req, res) {
   routes.index(req, res, http);
});

// handle two params route
app.get('/countryCd/:city', function (req, res) {
   routes.index(req, res, http);
});

// handle two params route
app.get('/countryCd/city', function (req, res) {
   routes.index(req, res, http);
});


http.createServer(app).listen(app.get('port'), function () {
   console.log("Express server listening on port " + app.get('port'));
});