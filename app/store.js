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
        data = (item.constructor === App.Vote) ? {_id: item._data.id} : item.serialize();
        json[key].push(data);
      });
    }
  },
  serializeBelongsTo: function(record, json, relationship) {
    var key = relationship.key,
    belongsToRecord = Ember.get(record, key);

    if (relationship.options.embedded === 'always') {
      json[key] = belongsToRecord.serialize();
    }
    else {
      return this._super(record, json, relationship);
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
            choice.votes.push(vote);
            newVote = {};
            newVote._id = vote
            votes.push(newVote);
          });
        });
        poll.choices = choice_ids;
        delete poll.choice_ids
    });
    payload = {votes: votes, choices: choices, polls: polls};
    return this._super(store, type, payload, id, requestType);
  },
  extractSingle: function(store, type, payload, id, requestType) {
    var currentUser = this.container.lookup('controller:application').get('currentUser');
    var choices = payload.poll.choices;
    payload.poll.choices = [];
    choices.forEach(function(choice){
      payload.poll.choices.push(choice._id);
    });
    if (payload.votes){
      payload.votes.forEach(function(vote){
        if (vote._user === currentUser.get('id')){
          vote.user_id = vote._user;
        }
      });
    }
    payload.poll.id = payload.poll._id;
    delete payload.poll._id;
    if (payload.votes){
      var updatedPayload = {votes: payload.votes, choices: choices, poll: payload.poll};
    } else {
      var updatedPayload = {choices: choices, poll: payload.poll};
    }
    return this._super(store, type, updatedPayload, id, requestType);
  }
});

App.ApplicationAdapter = DS.RESTAdapter.extend({
  namespace: 'api/1'
});

