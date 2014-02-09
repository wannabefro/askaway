App.SignUpRoute = Ember.Route.extend({
  model: function(){
    return this.store.createRecord('user');
  },

  actions: {
    save: function(model){
      var _this = this;
      data = model.getProperties('email', 'password');
      $.post('/signup', data).then(function(response){
        _this.controllerFor('login').send('authenticate', data);
      }, function(err){
      });
    }
  }
});
