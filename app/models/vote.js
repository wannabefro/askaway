App.Vote = DS.Model.extend({
  choice: DS.belongsTo('choice'),
  user: DS.belongsTo('user')
});
