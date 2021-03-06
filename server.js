var express = require('express');
var mongoose = require('mongoose');
var path = require('path');
var app = express();
var http = require('http')
var passport = require('passport');
var flash = require('connect-flash');
var server = http.createServer(app);
var io = require('socket.io').listen(server);
var routes = require('./server/controllers/polls');

mongoose.set('debug', true);
// This is the location of your mongo server, as well as the db name.
mongoose.connect('mongodb://127.0.0.1/ask_away_development');
require('./config/passport')(passport); // pass passport for configuration

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.use(express.logger('dev'));
  app.use(express.json());
  app.use(express.urlencoded());
  app.use(express.methodOverride());
  app.use(express["static"](path.join(__dirname, 'public')));
  // required for passport
  app.use( express.cookieParser() );
  app.use(express.session({ secret: 'verysecretsecret', cookie: {maxAge: 60000}})); // session secret
  app.use(passport.initialize());
  app.use(passport.session()); // persistent login sessions
  app.use(flash()); // use connect-flash for flash messages stored in session
  app.use(app.router);
})

if ('development' === app.get('env')) {
  app.use(express.errorHandler());
}


require('./server/routes')(app, passport);


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

io.sockets.on('connection', routes.vote);

// Starting the server
server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
