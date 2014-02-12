App.Poll = DS.Model.extend({
  question: DS.attr(),
  public: DS.attr('boolean', {defaultValue: true}),
  choices: DS.hasMany('choice'),
  user: DS.belongsTo('user'),

  totalVotes: function(){
    total = 0;
    this.get('choices').forEach(function(choice){
      total += choice.get('voteCount');
    });
    return total;
  }.property('choices.@each.voteCount')
});
