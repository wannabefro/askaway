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

      json[key] = [];
      property.forEach(function(item, index){
        json[key].push(item.serialize());
      });
    }
  }
});

App.PollSerializer = DS.RESTSerializer.extend({
  extractArray: function(store, type, payload, id, requestType) {
    var polls = payload.polls;
    choices = [];
    polls.forEach(function(poll){
        poll.id = poll._id;
        delete poll._id;
        choice_ids = [];
        poll.choices.forEach(function(choice){
          choice_ids.push(choice._id);
          choices.push(choice);
        });
        poll.choices = choice_ids;
        delete poll.choice_ids
    });
    payload = {choices: choices, polls: polls};
    return this._super(store, type, payload, id, requestType);
  },
  extractSingle: function(store, type, payload, id, requestType) {
    var choices = payload.choices;
    payload.choices = [];
    choices.forEach(function(choice){
      payload.choices.push(choice._id);
    });
    payload.id = payload._id;
    delete payload._id;
    payload = {choices: choices, poll: payload};
    return this._super(store, type, payload, id, requestType);
  }
});

App.ApplicationAdapter = DS.RESTAdapter.extend({
  namespace: 'api/1'
});

