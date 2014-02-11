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
    votes = [];
    polls.forEach(function(poll){
        poll.id = poll._id;
        delete poll._id;
        choice_ids = [];
        poll.choices.forEach(function(choice){
          choice_ids.push(choice._id);
          choices.push(choice);
          choiceVotes = choice.votes;
          choice.votes = [];
          choiceVotes.forEach(function(vote){
            choice.votes.push(vote._id);
            votes.push(vote);
          });
        });
        poll.choices = choice_ids;
        delete poll.choice_ids
    });
    payload = {votes: votes, choices: choices, polls: polls};
    return this._super(store, type, payload, id, requestType);
  },
  extractSingle: function(store, type, payload, id, requestType) {
    var choices = payload.choices;
    payload.choices = [];
    var votes = [];
    choices.forEach(function(choice){
      choiceVotes = choice.votes;
      payload.choices.push(choice._id);
      choiceVotes.forEach(function(vote){
        vote.choice_id = choice._id;
        votes.push(vote);
      });
    });
    payload.id = payload._id;
    delete payload._id;
    var updatedPayload = {votes: votes, choices: choices, poll: payload};
    return this._super(store, type, updatedPayload, id, requestType);
  }
});

App.ApplicationAdapter = DS.RESTAdapter.extend({
  namespace: 'api/1'
});

