App.User = DS.Model.extend({
  email: DS.attr(),
  votes: DS.hasMany('vote'),
  polls: DS.hasMany('poll')
});
