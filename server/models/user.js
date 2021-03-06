// app/models/user.js
// load the things we need
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;
var bcrypt   = require('bcrypt-nodejs');
var hat      = require('hat');

// define the schema for our user model
var userSchema = mongoose.Schema({
    votes: [{
      type: Schema.Types.ObjectId, ref: 'Vote'
    }],
    local            : {
        email        : String,
        password     : String,
        token        : String,
    },
    facebook         : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    },
    twitter          : {
        id           : String,
        token        : String,
        displayName  : String,
        username     : String
    },
    google           : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    },

});

// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.generateToken = function(){
  return hat();
}

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
