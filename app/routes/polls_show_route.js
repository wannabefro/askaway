App.PollsShowRoute = Ember.Route.extend({
  model: function(params){
    return this.store.find('poll', params.poll_id);
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