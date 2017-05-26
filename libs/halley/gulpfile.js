/* jshint node:true, unused:true */
'use strict';

var gulp        = require('gulp');
var webpack     = require('gulp-webpack');
var gzip        = require('gulp-gzip');
var sourcemaps  = require('gulp-sourcemaps');
var gutil       = require('gulp-util');
var webpack     = require('webpack');
var uglify      = require('gulp-uglify');
var mocha       = require('gulp-spawn-mocha');
var KarmaServer = require('karma').Server;

gulp.task("webpack-standalone", function(callback) {
    // run webpack
    webpack({
      entry: "./browser-standalone.js",
      output: {
        path: "dist/",
        filename: "halley.js",
        libraryTarget: "umd",
        library: "Halley"
      },
      stats: true,
      failOnError: true,
      node: {
        console: false,
        global: true,
        process: false,
        Buffer: false,
        __filename: false,
        __dirname: false,
        setImmediate: false
      },
    }, function(err, stats) {
        if(err) throw new gutil.PluginError("webpack", err);
        gutil.log("[webpack]", stats.toString({
            // output options
        }));
        callback();
    });
});

gulp.task("webpack-backbone", function(callback) {
    // run webpack
    webpack({
      entry: "./backbone.js",
      output: {
        path: "dist/",
        filename: "halley-backbone.js",
        libraryTarget: "umd",
        library: "Halley"
      },
      externals: {
        "backbone": "Backbone",
        "underscore": "_"
      },
      stats: true,
      failOnError: true,
      node: {
        console: false,
        global: true,
        process: false,
        Buffer: false,
        __filename: false,
        __dirname: false,
        setImmediate: false
      },
    }, function(err, stats) {
        if(err) throw new gutil.PluginError("webpack", err);
        gutil.log("[webpack]", stats.toString({
            // output options
        }));
        callback();
    });
});
gulp.task('webpack', ['webpack-backbone', 'webpack-standalone']);

gulp.task('uglify', ['webpack'], function() {
  return gulp.src('dist/*.js', { base: 'dist/' })
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(uglify({

    }))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest('dist/min'));
});

gulp.task('gzip', ['uglify'], function () {
    return gulp.src(['dist/min/**'], { stat: true })
      .pipe(gzip({ append: true, gzipOptions: { level: 9 } }))
      .pipe(gulp.dest('dist/min'));
});

gulp.task("webpack-test-suite-browser", function(callback) {
    // run webpack
    webpack({
      entry: "./test/integration/public/test-suite-browser.js",
      output: {
        path: "dist/",
        filename: "test-suite-browser.js",
      },
      stats: true,
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
      failOnError: true,
      node: {
        console: false,
        global: true,
        process: true,
        Buffer: false,
        __filename: false,
        __dirname: false,
        setImmediate: false
      },
    }, function(err, stats) {
        if(err) throw new gutil.PluginError("webpack", err);
        gutil.log("[webpack]", stats.toString({
            // output options
        }));
        callback();
    });
});

gulp.task('test-coverage', function() {
  return gulp.src(['test/test-suite-node.js'], { read: false })
    .pipe(mocha({
      exposeGc: true,
      istanbul: {
        dir: 'dist/coverage'
      }
    }));
});

gulp.task('test', function() {
  return gulp.src(['test/test-suite-node.js'], { read: false })
    .pipe(mocha({
      exposeGc: true
    }));
});

gulp.task('karma', function (done) {
  var fork = require('child_process').fork;

  var child = fork('./test/helpers/server');

  process.on('exit', function() {
    child.kill();
  });

  setTimeout(function() {
    function karmaComplete(err) {
      if (err) {
        console.log('ERROR IS')
        console.log(err.stack);
      }
      child.kill();
      done(err);
    }

    var karma = new KarmaServer({
      configFile: __dirname + '/karma.conf.js',
      browsers: ['Firefox', 'Chrome', 'Safari'],
      singleRun: true,
      concurrency: 1
    }, karmaComplete);

    karma.start();

  }, 1000);

});

gulp.task('default', ['webpack', 'uglify', 'gzip', 'test-coverage']);
