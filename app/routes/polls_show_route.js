App.PollsShowRoute = Ember.Route.extend({
  fromIndex: false,
  beforeModel: function(transition){
    try {
      transitionedFrom = transition.router.targetHandlerInfos[2].name;
    } catch(e){
    }
    if (transition.router.targetHandlerInfos && (transitionedFrom ===  'polls.index' || transitionedFrom === 'polls.edit')){
      this.set('fromIndex', true);
    }
  },
  activate: function(){
    if (this.get('fromIndex')){
      var _this = this;
      var currentUserId = this.controllerFor('application').get('currentUser.id');
      this.modelFor('pollsShow').reload().then(function(response){
        response._data.choices.forEach(function(choice){
          choice._data.votes.some(function(vote){
            if (vote._data.user.id === currentUserId){
              _this.controllerFor('pollsShow').set('hasNotVoted', false);
              return true;
            }
          });
        });
      });
    }
  },
  model: function(params){
    var _this = this;
    var currentUserId = this.controllerFor('application').get('currentUser.id');
    return this.store.find('poll', params.poll_id).then(function(response){
      response._data.choices.forEach(function(choice){
        choice._data.votes.some(function(vote){
          if (vote._data.user.id === currentUserId){
            _this.controllerFor('pollsShow').set('hasNotVoted', false);
            return true;
          }
        });
      });
      return response;
    });
  },

  deactivate: function(){
    this.set('fromIndex', false);
    this.controller.set('hasNotVoted', true);
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
