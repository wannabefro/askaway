App.Choice = DS.Model.extend({
  text: DS.attr(),
  poll: DS.belongsTo('poll')
});
