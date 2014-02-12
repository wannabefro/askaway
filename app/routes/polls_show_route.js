App.PollsShowRoute = Ember.Route.extend({
  fromIndex: false,
  beforeModel: function(transition){
    if (transition.router.targetHandlerInfos && transition.router.targetHandlerInfos[2].name === 'polls.index'){
      this.set('fromIndex', true);
    }
  },
  model: function(params){
    return this.store.find('poll', params.poll_id);
  },

  deactivate: function(){
    this.controller.set('hasNotVoted', true);
  },

  setupController: function(controller, model){
    oldModel = model;
    if (this.get('fromIndex')){
      var _this = this;
      oldModel.deleteRecord();
      this.store.find('poll', model.id).then(function(response){
        _this.model = response;
      });
    }
    controller.set('model', model);
    if (model._data){
    currentUser = this.controllerFor('application').get('currentUser');
    model._data.choices.forEach(function(choice){
      choice.get('votes').forEach(function(vote){
        if (vote._data.user_id){
          currentUser.get('votes').addObject(vote);
          controller.set('hasNotVoted', false);
        }
      });
    });
    this.set('fromIndex', false);
    }
    oldModel.rollback();
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
