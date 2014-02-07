App.PollsShowController = Ember.ObjectController.extend({
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
      data = {poll_id: id, choice: choice_id};
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
