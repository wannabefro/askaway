var Poll = require('../models/poll');

exports.index = function(req, res) {
  Poll.find(function(err, polls) {
    res.send({
      polls: polls
    });
  });
};

exports.create = function(req, res) {
  res.send(new Poll(req.body.poll).save());
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
