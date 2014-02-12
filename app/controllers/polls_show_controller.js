App.PollsShowController = Ember.ObjectController.extend({
  needs: 'application',
  currentUser: Ember.computed.alias('controllers.application.currentUser'),
  canEdit: function(){
    if (this.get('content.user') === this.get('currentUser')){
      return true;
    }
  }.property('currentUser', 'model'),
  hasNotVoted: true,
  events: {
    myvote: function(vote){
      choice = this.store.getById('choice', vote.kind_id);
      vote = this.store.createRecord('vote', {id: vote._id, user: this.get('currentUser'), choice: choice});
      choice.get('votes').addObject(vote);
      this.get('currentUser.votes').addObject(vote);
      this.set('hasNotVoted', false);
    },
    vote: function(vote){
      choice = this.store.getById('choice', vote.kind_id);
      vote = this.store.createRecord('vote', {id: vote._id, choice: choice});
      choice.get('votes').addObject(vote);
    }
  },

  actions: {
    vote: function(choice) {
      var id = this.get('id');
      var choice_id = choice.get('id');
      var user_id = this.get('currentUser.id');
      data = {poll_id: id, choice_id: choice_id, user_id: user_id};
      this.socket.emit('send:vote', data);
    }
  }
});
