App.PollsEditRoute = Ember.Route.extend({
  model: function(params) {
    return this.store.find('poll', params.poll_id);
  },
  deactivate: function() {
    var model = this.get('controller.model');
    model.rollback();
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
      model.save().then(function() {
        model.get('choices.content').filterBy('isDirty').forEach(function(choice){
          choice.deleteRecord();
        });
        _this.transitionTo('polls.show', model);
      });
    },
    cancel: function(model) {
      this.transitionTo('polls.show', model);
    }
  }
});
