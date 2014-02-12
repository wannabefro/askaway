var Poll = require('../models/poll');
var Vote = require('../models/vote');
var User = require('../models/user');
var async = require('async');
var mongoose = require('mongoose');

exports.index = function(req, res) {
  Poll.find({public: true}, function(err, polls) {
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
  async.series([
  function(callback){
    var choiceIndex = 0;
    async.forEach(req.body.poll.choices, function(choice, callback1){
      var voteIndex = 0;
      async.forEach(choice.votes, function(vote, callback2){
        req.body.poll.choices[choiceIndex].votes[voteIndex] = mongoose.Types.ObjectId(vote._id);
        voteIndex++;
        callback2();
      });
      choiceIndex++;
      callback1();
      callback();
    });
  },
  function(callback){
  Poll.findByIdAndUpdate(req.params.id, req.body.poll, function(err, poll) {
    res.send({poll: poll});
    callback();
  });
  }
  ]);
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
