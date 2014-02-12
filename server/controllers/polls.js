var Poll = require('../models/poll');
var Vote = require('../models/vote');
var User = require('../models/user');
var async = require('async');

exports.index = function(req, res) {
  Poll.find(function(err, polls) {
    res.send({
      polls: polls
    });
  });
};

exports.show = function(req, res) {
  data = {}
  async.series([
    function(callback){
    Poll.findById(req.params.id, function(err, poll){
      data.poll = poll;
      callback(null, 'done');
    });
  },
  function(finalCallback){
    var votes = [];
    async.forEach(data.poll.choices, function(choice, callback1){
      async.forEach(choice.votes, function(vote, callback){
        Vote.findById(vote, function(err, vote){
          votes.push(vote);
          callback();
        });
      }, function(err){
        callback1();
      });
    }, function(err){
        data.votes = votes;
        finalCallback(null, 'done');
    });
  }
  ], function(err, result){
    console.log('alldone');
    res.send(data);
  });
}

exports.create = function(req, res) {
  req.body.poll.user = req.user._id;
  new Poll(req.body.poll).save(function (err, poll, numberAffected){
    if (err){
    } else {
      res.send({poll: poll});
    }
  });
};

exports.update = function(req, res) {
  Poll.findByIdAndUpdate(req.params.id, req.body.poll, function(err, poll) {
    res.send({poll: poll});
  });
};

exports.destroy = function(req, res) {
  Poll.findByIdAndRemove(req.params.id, function(err, poll) {
    res.send(poll);
  });
};

exports.vote = function(socket) {
  socket.on('send:vote', function(data) {
    var vote = new Vote({ kind: 'choice', user: data.user_id, kind_id: data.choice_id});
    vote.save(function(err){
      Vote.findOne(vote).populate('user').exec(function(err,item){
      });
      User.findById(data.user_id, function(err, user){
        user.votes.push(vote);
        user.save();
      });
      Vote.findOne(vote).populate('kind_id').exec();
      Poll.findById(data.poll_id, function(err, poll){
        var choice = poll.choices.id(data.choice_id);
        choice.votes.push(vote);
        poll.save();
      });
    });
    socket.emit('myvote', vote);
    socket.broadcast.emit('vote', vote);
  });
};
    // Poll.findById(data.poll_id, function(err, poll) {
    //   var choice = poll.choices.id(data.choice_id);
    //   var vote = choice.votes.push({ user: data.user_id });      
    //   poll.save(function(err, doc) {
    //     console.log('the vote is' +vote); 
        // var theDoc = { 
        //   question: doc.question, _id: doc._id, choices: doc.choices, 
        //   userVoted: false, totalVotes: 0 
        // };
        // for(var i = 0, ln = doc.choices.length; i < ln; i++) {
        //   var choice = doc.choices[i]; 
        //   for(var j = 0, jLn = choice.votes.length; j < jLn; j++) {
        //     var vote = choice.votes[j];
        //     theDoc.totalVotes++;
        //     theDoc.userVoted = true;
        //     theDoc.userChoice = { _id: choice._id, text: choice.text };
        //   }
