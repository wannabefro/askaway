App.PollsNewRoute = Ember.Route.extend({
  model: function() {
    poll = this.store.createRecord('poll');
    for(var i=0;i<3;i++){
      choice = this.store.createRecord('choice', {poll: poll});
      poll.get('choices').addObject(choice);
    };
    return poll;
  },
  deactivate: function() {
    var model = this.get('controller.model');
    if (model.get('isNew')) {
      model.get('choices.content').forEach(function(choice){
        choice.deleteRecord();
      });
      model.deleteRecord();
    }
  },
  actions: {
    newChoice: function(model) {
      this.store.createRecord('choice', {poll: model});
    },

    removeChoice: function(model){
      this.store.deleteRecord(model);
    },
    save: function(model) {
      var _this = this;
      model.save().then(function(response) {
        model.get('choices.content').filterBy('isDirty').forEach(function(choice){
          choice.deleteRecord();
        });
        model.set('id', response._data._id);
        _this.transitionTo('polls.show', model);
      });
    },
    cancel: function() {
      this.transitionTo('polls.index');
    }
  }
});
