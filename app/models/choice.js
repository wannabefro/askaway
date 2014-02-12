App.Choice = DS.Model.extend({
  text: DS.attr(),
  poll: DS.belongsTo('poll'),
  votes: DS.hasMany('vote'),

  voteCount: function(){
    return this.get('votes.content').length;
  }.property('votes.@each'),

  editable: function(){
    return (this.get('votes.content').length === 0) ? true : false
  }.property('votes.@each')
});
