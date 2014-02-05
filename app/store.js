App.ApplicationSerializer = DS.RESTSerializer.extend({
  primaryKey: '_id'
});

DS.JSONSerializer.reopen({
  serializeHasMany: function(record, json, relationship) {
    var key = relationship.key,
    property = Ember.get(record, key),
    relationshipType = DS.RelationshipChange.determineRelationshipType(record.constructor, relationship);

    if (property && relationshipType === 'manyToNone' || relationshipType === 'manyToMany' ||
        relationshipType === 'manyToOne') {

      // Add each serialized nested object
      json[key] = [];
      property.forEach(function(item, index){
        json[key].push(item.serialize());
      });
    }
  }
});

App.ApplicationAdapter = DS.RESTAdapter.extend({
  namespace: 'api/1'
});
