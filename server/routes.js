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
    res.send({message: 'success'});
  });
  app.post('/login', passport.authenticate('local-login'), function(req, res){
    data = {access_token: req.user.local.token, token_type: "bearer"};
    res.send(data);
  });
};
function isLoggedIn(req, res, next){
  if (req.isAuthenticated()){
    return next();
  }
}
