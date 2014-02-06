App.Router.map(function() {
  this.resource('polls', {path: '/'}, function() {
    this.route('new');
    this.route('show', {path: ':poll_id'});
    this.route('edit', {path: ':poll_id/edit'});
  });
});
