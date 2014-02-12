var User          = require('../server/models/user');
var polls = require('./controllers/polls');

module.exports = function(app, passport){
  app.get('/api/1/polls', polls.index);
  app.get('/api/1/polls/:id', polls.show);
  app.post('/api/1/polls', isLoggedIn, polls.create);
  app.put('/api/1/polls/:id', polls.update);
  app.post('/api/1/votes', polls.vote);
  app.del('/api/1/polls/:id', polls.destroy);
  app.post('/logout', function(req, res){
    User.findOne({'local.email': req.user.local.email}, function(err, user){
      user.local.token = null;
      user.save();
    });
    req.logout();
  });
  app.post('/signup', passport.authenticate('local-signup'), function(req, res){
    res.send({message: 'success'});
  });
  app.post('/login', passport.authenticate('local-login'), function(req, res){
    data = {
      access_token: req.user.local.token, 
      token_type: "bearer",
      user: {votes: req.user.local.votes, email: req.user.local.email, id: req.user.id}};
    res.send(data);
  });
};
function isLoggedIn(req, res, next){
  if (req.isAuthenticated()){
    return next();
  }
}
