App.ApplicationSerializer = DS.RESTSerializer.extend({
  primaryKey: '_id'
});

App.ApplicationAdapter = DS.RESTAdapter.extend({
  namespace: 'api/1'
});
