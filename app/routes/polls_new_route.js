App.PollsNewRoute = Ember.Route.extend({
  model: function() {
    return this.store.createRecord('poll');
  },
  deactivate: function() {
    var model = this.get('controller.model');
    if (model.get('isNew')) {
      model.deleteRecord();
    }
  },
  actions: {
    save: function(model) {
      var _this = this;
      model.save().then(function() {
        _this.transitionTo('polls.show', model);
      });
    },
    cancel: function() {
      this.transitionTo('polls.index');
    }
  }
});
