var Poll = require('../models/poll');

exports.index = function(req, res) {
  Poll.find(function(err, polls) {
    res.send({
      polls: polls
    });
  });
};

exports.show = function(req, res) {
  Poll.findById(req.params.id, function(err, poll){
    res.send(poll);
  });
}

exports.create = function(req, res) {
  new Poll(req.body.poll).save(function (err, poll, numberAffected){
    if (err){
    } else {
      res.send(poll);
    }
  });
};

exports.update = function(req, res) {
  Poll.findByIdAndUpdate(req.params.id, req.body.poll, function(err, poll) {
    res.send(poll);
  });
};

exports.destroy = function(req, res) {
  Poll.findByIdAndRemove(req.params.id, function(err, poll) {
    res.send(poll);
  });
};

exports.vote = function(req, res){
};
