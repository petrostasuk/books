var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../app/models/User');

passport.serializeUser(function (user, cb) {
  if (user)
    cb(null, user.id);
  else
    cb(null, null);
});

passport.deserializeUser(function (id, cb) {
  User.findById(id, function (err, user) {
    cb(err, user);
  });
});

passport.use(new LocalStrategy({usernameField: 'email'}, function (email, password, callback) {
  User.findOne({email: email}, function (err, user) {
    if (!user) {
      return callback(null, null, [{msg: 'Email not found.'}]);
    }
    user.comparePassword(password, function (err, isValid) {
      if (isValid) {
        return callback(null, user);
      }
      return callback(null, null, [{msg: 'Invalid password.'}]);
    });
  });
}));

exports.isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({
    msg: 'Login required'
  })
};
