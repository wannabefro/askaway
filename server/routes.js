var polls = require('./controllers/polls');

module.exports = function(app){
  app.get('/api/1/polls', polls.index);
  app.get('/api/1/polls/:id', polls.show);
  app.post('/api/1/polls', polls.create);
  app.put('/api/1/polls/:id', polls.update);
  app.post('/api/1/votes', polls.vote);
  app.del('/api/1/polls/:id', polls.destroy);
};
