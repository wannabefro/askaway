App.PollsShowController = Ember.ObjectController.extend({
  needs: 'application',
  currentUser: Ember.computed.alias('controllers.application.currentUser'),
  canEdit: true,
  events: {
    myvote: function(vote){
      this.send('addVote', vote);
    },
    vote: function(vote){
      this.send('addVote', vote);
    }
  },

  actions: {
    vote: function(choice) {
      var id = this.get('id');
      var choice_id = choice.get('id');
      var user_id = this.get('currentUser.id');
      data = {poll_id: id, choice_id: choice_id, user_id: user_id};
      this.socket.emit('send:vote', data);
    },

    addVote: function(vote){
      var _this = this;
      vote.choices.forEach(function(choice){
        var voteChoice = _this.store.getById('choice', choice._id);
        choice.votes.forEach(function(vote){
          vote.id = vote._id;
          vote.choice_id = voteChoice._id;
          delete vote._id;
          var vote = _this.store.push('vote', vote);
          voteChoice.get('votes').addObject(vote);
        });
      });
    }
  }
});
