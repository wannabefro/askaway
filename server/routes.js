var polls = require('./controllers/polls');

module.exports = function(app){
  app.get('/api/1/polls', polls.index);
  app.post('/api/1/polls', polls.create);
  app.put('/api/1/polls/:id', polls.update);
  app.del('/api/1/polls/:id', polls.destroy);
};
