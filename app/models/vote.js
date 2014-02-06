App.Vote = DS.Model.extend({
  ip: DS.attr(),
  choice: DS.belongsTo('choice')
});
