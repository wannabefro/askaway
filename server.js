var express = require('express');
var mongoose = require('mongoose');
var path = require('path');
var app = express();

mongoose.set('debug', true);
// This is the location of your mongo server, as well as the db name.
mongoose.connect('mongodb://127.0.0.1/express_ember_example');

app.set('port', process.env.PORT || 3000);
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express["static"](path.join(__dirname, 'public')));

if ('development' === app.get('env')) {
  app.use(express.errorHandler());
}

require('./server/routes')(app);

app.get('/app.js', function(req, res) {
  return res.sendfile('./public/app.js');
});

app.get('/app.css', function(req, res) {
  return res.sendfile('./public/app.css');
});

// This delegates all of the routes we haven't set to Ember.JS
app.get('*', function(request, response) {
  console.log(request.query);
  return response.sendfile('./public/index.html');
});

// Starting our server
app.listen(app.get('port'), function() {
  return console.log('Express server listening on port ' + app.get('port'));
});
