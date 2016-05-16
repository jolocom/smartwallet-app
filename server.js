/* eslint-disable */

var express = require('express');
var cookieParser = require('cookie-parser')
var cookieSession = require('cookie-session')
var bodyParser = require('body-parser');
var path = require('path');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var httpProxy = require('http-proxy');
var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var proxy = httpProxy.createProxyServer({
  changeOrigin: true,
  secure: false
});
var app = express();

var isProduction = process.env.NODE_ENV === 'production';
var port = process.env.PORT || 3000;
var publicPath = path.resolve(__dirname, 'dist');

mongoose.connect('mongodb://localhost/jolocom');

var UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  email: String
});

UserSchema.plugin(passportLocalMongoose);

var User = mongoose.model('User', UserSchema);

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(cookieParser());
app.use(cookieSession({
  name: 'session',
  keys: ['jolocom1', 'jolocom2']
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(publicPath));

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
    return next();

  res.json({});
}

app.get('/user', isLoggedIn, function(req, res, next) {
  res.json(req.user);
});

app.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err); }
    if (!user) { return res.sendStatus(403); }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      return res.json({
        success: true,
        username: user.username
      });
    });
  })(req, res, next);
});

app.get('/logout', function(req, res) {
  req.logout();
  res.json({success: true})
});

app.post('/register', function(req, res) {
  User.register(new User({username: req.body.username, email: req.body.email}), req.body.password, function(err, user) {
    if (err) {
      return res.json({
        success: false,
        error: err.message
      });
    }

    passport.authenticate('local')(req, res, function () {
      res.json({success: true, username: user.username});
    });
  });
});

// We only want to run the workflow when not in production
if (!isProduction) {

  // We require the bundler inside the if block because
  // it is only needed in a development environment. Later
  // you will see why this is a good idea
  var bundle = require('./server/bundle.js');
  bundle();

  // Any requests to localhost:3000/build is proxied
  // to webpack-dev-server
  app.all('/js/*', function (req, res) {
    proxy.web(req, res, {
      target: 'http://localhost:8080'
    });
  });

}

app.all('/data/*', function (req, res) {
  req.url = req.url.replace('/data', '')
  proxy.web(req, res, {
    target: 'https://localhost:8443',
    prependPath: false
  });
});

// It is important to catch any errors from the proxy or the
// server will crash. An example of this is connecting to the
// server when webpack is bundling
proxy.on('error', function(e) {
  console.log('Could not connect to proxy, please try again...');
});

app.listen(port, function () {
  console.log('Server running on port ' + port);
});
