App.Router.map(function() {
  return this.resource('polls', {
    path: '/'
  }, function() {
    return this.route('new');
  });
});
