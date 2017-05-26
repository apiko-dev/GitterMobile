var webpack = require('webpack');
var internalIp = require('internal-ip');

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha'],


    // list of files / patterns to load in the browser
    files: [
      'test/test-suite-browser.js'
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'test/test-suite-browser.js': ['webpack']
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,

    browserStack: {
      username: process.env.BROWSERSTACK_USERNAME,
      accessKey: process.env.BROWSERSTACK_KEY
    },

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome', 'Firefox', 'Safari'],
/*
    customLaunchers: {
      bs_firefox_mac: {
        base: 'BrowserStack',
        browser: 'firefox',
        browser_version: '21.0',
        os: 'OS X',
        os_version: 'Mountain Lion'
      },
      bs_iphone5: {
        base: 'BrowserStack',
        device: 'iPhone 5',
        os: 'ios',
        os_version: '6.0'
      }
    },

    browsers: ['bs_firefox_mac'],
*/
    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    webpack: {
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
      devtool: 'inline-source-map',
      node: {
        console: false,
        global: true,
        process: true,
        Buffer: false,
        __filename: false,
        __dirname: false,
        setImmediate: false
      },
      plugins: [
        new webpack.DefinePlugin({
          HALLEY_TEST_SERVER: JSON.stringify('http://' + internalIp.v4() + ':8000')
        })
      ]
    },

    webpackMiddleware: {

    },

    plugins: [
      require("karma-mocha"),
      require("karma-chrome-launcher"),
      require("karma-firefox-launcher"),
      require("karma-safari-launcher"),
      require("karma-browserstack-launcher"),
      require("karma-webpack")
    ],

    captureTimeout: 60000,
     // to avoid DISCONNECTED messages
    browserDisconnectTimeout : 10000, // default 2000
    browserDisconnectTolerance : 1, // default 0
    browserNoActivityTimeout : 60000, //default 10000
  });
};
