var polls = require('./controllers/polls');

module.exports = function(app, passport){
  app.get('/api/1/polls', polls.index);
  app.get('/api/1/polls/:id', polls.show);
  app.post('/api/1/polls', polls.create);
  app.put('/api/1/polls/:id', polls.update);
  app.post('/api/1/votes', polls.vote);
  app.del('/api/1/polls/:id', polls.destroy);
  app.get('/logout', function(req, res){
    req.logout();
  });
  app.post('/signup', passport.authenticate('local-signup'), function(req, res){
    res.send(req.user.email);
  });
};
function isLoggedIn(req, res, next){
  if (req.isAuthenticated()){
    return next();
  }
}
