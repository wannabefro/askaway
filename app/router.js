App.Router.map(function() {
  this.route('login');
  this.route('sign_up');
  this.route('home', {path: '/'});
  this.resource('polls', function() {
    this.route('new');
    this.route('show', {path: ':poll_id'});
    this.route('edit', {path: ':poll_id/edit'});
  });
});
