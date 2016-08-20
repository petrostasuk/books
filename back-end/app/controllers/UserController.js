var User = require('../models/User');
var passport = require('passport');

module.exports = {

  // GET /user/me
  me: function (req, res) {
    if (req.user) {
      res.status(200).json(req.user);
    }
  },

  // POST /login
  login: function (req, res, next) {
    req.assert('email', 'Email is not valid').isEmail();
    req.assert('password', 'Password cannot be blank').notEmpty();

    var errors = req.validationErrors();
    if (errors) {
      return res.status(400).json(errors);
    }
    passport.authenticate('local', function (err, user, info) {
      if (err) {
        return next(err);
      }
      if (!user) {
        console.log(info)
        return res.status(401).json(info);
      }
      req.logIn(user, function (err) {
        if (err) {
          return next(err);
        }
        res.status(200).json(user);
      });
    })(req, res, next);
  },

  // GET /logout
  logout: function (req, res) {
    req.logout();
    res.status(401).json({
      msg: 'Login required'
    })
  },

  // POST /signup
  signup: function (req, res) {

    req.assert('email', 'Email is not valid').isEmail();
    req.assert('password', 'Password must be at least 4 characters long').len(4);
    req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);

    var errors = req.validationErrors();

    if (errors) {
      return res.status(400).json(errors);
    }

    User.findOne({email: req.body.email}, function (err, existUser) {
      if (existUser) {
        return res.status(400).json([
          {
            param: 'email',
            msg: 'email address already exists'
          }
        ]);
      }
      var user = new User({
        email: req.body.email,
        password: req.body.password
      });
      user.save(function (err) {
        if (err) {
          return res.status(400).json(err);
        }
        res.status(200).json(user);
      })
    });

  }

};
