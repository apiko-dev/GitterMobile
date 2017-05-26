/* jshint node:true */
'use strict';

var http = require('http');
var express = require('express');
var webpack = require('webpack');
var webpackMiddleware = require("webpack-dev-middleware");
var PUBLIC_DIR = __dirname + '/public';
var debug = require('debug')('halley:test:server');
var BayeuxWithProxyServer = require('./bayeux-with-proxy-server');
var internalIp = require('internal-ip');
var enableDestroy = require('server-destroy');

var localIp = process.env.HALLEY_LOCAL_IP || internalIp.v4();

var idCounter = 0;
var servers = {};
var server;

var port = process.env.PORT || '8000';

function listen(options, callback) {
  var app = express();
  server = http.createServer(app);
  enableDestroy(server);

  if (options.webpack) {
    app.use(webpackMiddleware(webpack({
      context: __dirname + "/..",
      entry: "mocha!./test-suite-browser",
      output: {
        path: __dirname + "/",
        filename: "test-suite-browser.js"
      },
      resolve: {
        alias: {
          sinon: 'sinon-browser-only'
        }
      },
      module: {
        noParse: [
          /sinon-browser-only/
        ]
      },
      devtool: "#eval",
      node: {
        console: false,
        global: true,
        process: true,
        Buffer: false,
        __filename: false,
        __dirname: false,
        setImmediate: false
      },
      plugins:[
        new webpack.DefinePlugin({
          HALLEY_TEST_SERVER: JSON.stringify('http://' + localIp + ':' + port)
        })
      ]

    }), {
      noInfo: false,
      quiet: false,

      watchOptions: {
          aggregateTimeout: 300,
          poll: true
      },

      publicPath: "/",
      stats: { colors: true }
    }));

    app.use(express.static(PUBLIC_DIR));
  }

  app.all('/*', function(req, res, next) {
    res.set('Access-Control-Allow-Origin', '*');
    next();
  });

  app.post('/setup', function(req, res, next) {
    var server = new BayeuxWithProxyServer(localIp);
    var id = idCounter++;
    servers[id] = server;
    server.start(function(err, urls) {
      if (err) return next(err);

      res.send({ id: id, urls: urls });
    });
  });

  app.post('/control/:id/teardown', function(req, res, next) {
    var id = req.params.id;

    var server = servers[id];
    delete servers[id];

    server.stop(function(err) {
      if (err) return next(err);
      res.send('OK');
    });
  });

  app.post('/control/:id/delete/:clientId', function(req, res, next) {
    var id = req.params.id;
    var clientId = req.params.clientId;
    var server = servers[id];

    server.deleteSocket(clientId)
      .then(function() {
        res.send('OK');
      })
      .catch(next);
  });


  app.post('/control/:id/network-outage', function(req, res, next) {
    var id = req.params.id;
    var server = servers[id];

    server.networkOutage()
      .then(function() {
        res.send('OK');
      })
      .catch(next);
  });

  app.post('/control/:id/restore-all', function(req, res, next) {
    var id = req.params.id;
    var server = servers[id];

    server.restoreAll()
      .then(function() {
        res.send('OK');
      })
      .catch(next);
  });

  app.post('/control/:id/restart', function(req, res, next) {
    var id = req.params.id;
    var server = servers[id];

    server.restart()
      .then(function() {
        res.send('OK');
      })
      .catch(next);
  });

  app.post('/control/:id/stop-websockets', function(req, res, next) {
    var id = req.params.id;
    var server = servers[id];

    server.stopWebsockets()
      .then(function() {
        res.send('OK');
      })
      .catch(next);
  });

  app.use(function(err, req, res, next) { // jshint ignore:line
    res.status(500).send(err.message);
  });

  app.get('*', function(req, res) {
    res.status(404).send('Not found');
  });

  server.listen(port, callback);
}

function unlisten(callback) {
  debug('Unlisten');
  Object.keys(servers).forEach(function(id) {
    var server = servers[id];

    server.stop(function(err) {
      if (err) {
        debug('Error stopping server ' + err);
      }
    });

  });

  servers = {};
  server.destroy(callback);
}

exports.listen = listen;
exports.unlisten = unlisten;

if (require.main === module) {
  process.on('uncaughtException', function(e) {
    console.error(e.stack || e);
    process.exit(1);
  });

  listen({ webpack: true }, function(err) {

    if (err) {
      debug('Unable to start server: %s', err);
      return;
    }

    debug('Listening');
  });
}
