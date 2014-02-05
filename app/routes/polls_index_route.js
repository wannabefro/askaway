App.PollsIndexRoute = Ember.Route.extend({
  model: function(){
    return this.store.find('poll');
  },
  actions: {
    destroyRecord: function(model) {
      var _this = this;
      model.destroyRecord().then(function() {
        _this.transitionTo('polls.index');
      });
    }
  }
});
