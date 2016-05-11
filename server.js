/* eslint-disable */

var express = require('express');
var path = require('path');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var httpProxy = require('http-proxy');

var proxy = httpProxy.createProxyServer({
  changeOrigin: true,
  secure: false
});
var app = express();

var isProduction = process.env.NODE_ENV === 'production';
var port = isProduction ? process.env.PORT : 3000;
var publicPath = path.resolve(__dirname, 'dist');

passport.use(new LocalStrategy(
  function(username, password, done) {
    done(null, {username: username, password: password});
  }
));

app.use(express.static(publicPath));

app.get('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err); }
    if (!user) { return res.redirect('/login'); }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      return res.json({username: user.username});
    });
  })(req, res, next);
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
  app.all('/dist/*', function (req, res) {
    proxy.web(req, res, {
      target: 'http://localhost:8080'
    });
  });

  app.all('/data/*', function (req, res) {
    req.url = req.url.replace('/data', '')
    proxy.web(req, res, {
      target: 'https://localhost:8443',
      prependPath: false
    });
  });

}

// It is important to catch any errors from the proxy or the
// server will crash. An example of this is connecting to the
// server when webpack is bundling
proxy.on('error', function(e) {
  console.log('Could not connect to proxy, please try again...');
});

app.listen(port, function () {
  console.log('Server running on port ' + port);
});
