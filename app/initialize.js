window.App = Ember.Application.create({
  Socket: EmberSockets.extend({
    host: 'localhost',
    port: 3000,
    controllers: ['pollsShow']
  })
});

require('store');
require('router');

var folderOrder = [ 'initializers', 'routes', 'models', 'views', 'controllers', 'helpers',
  'templates', 'components' ];

  folderOrder.forEach(function(folder) {
    window.require.list().filter(function(module) {
      return new RegExp("^" + folder + "/").test(module);
    }).forEach(function(module) {
      require(module);
    });
  })
