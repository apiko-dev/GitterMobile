# Halley

[![Join the chat at https://gitter.im/gitterHQ/halley](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/gitterHQ/halley?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge) [![Build Status](https://travis-ci.org/gitterHQ/halley.svg)](https://travis-ci.org/gitterHQ/halley) [![Coverage Status](https://coveralls.io/repos/gitterHQ/halley/badge.svg?branch=master&service=github)](https://coveralls.io/github/gitterHQ/halley?branch=master)

Halley is an experimental fork of James Coglan's excellent Faye library.

## Differences from Faye

The main differences from Faye are (listed in no particular order):
* **Uses promises** (and Bluebird's promise cancellation feature) to do the heavy-lifting whereever possible.
* No Ruby client or server and no server support. Halley is a **Javascript Bayeux client only**
* **Webpack/browserify packaging**
* **Client reset support**. This will force the client to rehandshake. This can be useful when the application realises that the connection is dead before the bayeux client does and allows for faster recovery in these situations.
* **No eventsource support** as we've found them to be unreliable in a ELB/haproxy setup
* All **durations are in milliseconds**, not seconds
* Wherever possible, implementations have been replaced with external libraries:
  * Uses [bluebird](https://github.com/petkaantonov/bluebird/) for promises
  * Uses backbone events (or backbone-events-standalone) for events
  * Mocha/sinon/karma for testing

## Why's it called "Halley"?

Lots of reasons! Halley implements the Bayeux Protocol. The [Bayeux Tapestry](https://en.wikipedia.org/wiki/Bayeux_Tapestry)
contains the first know depiction of Halley's Comet. Halley is a [cometd](https://cometd.org) client.

### Usage

### Basic Example

```js
var Halley = require('halley');
var client = new Halley.Client('/bayeux');

function onMessage(message) {
  console.log('Incoming message', message);
}

client.subscribe('/channel', onMessage);

client.publish('/channel2', { value: 1 })
  .then(function(response) {
    console.log('Publish returned', response);
  })
  .catch(function(err) {
    console.error('Publish failed:', err);
  });
```

### Advanced Example

```js
var Halley = require('halley');
var Promise = require('bluebird');

/** Create a client (showing the default options) */
var client = new Halley.Client('/bayeux', {
  /* The amount of time to wait (in ms) between successive
   * retries on a single message send */
  retry: 30000,

  /**
   * An integer representing the minimum period of time, in milliseconds, for a
   * client to delay subsequent requests to the /meta/connect channel.
   * A negative period indicates that the message should not be retried.
   * A client MUST implement interval support, but a client MAY exceed the
   * interval provided by the server. A client SHOULD implement a backoff
   * strategy to increase the interval if requests to the server fail without
   * new advice being received from the server.
   */
  interval: 0,

  /**
   * An integer representing the period of time, in milliseconds, for the
   * server to delay responses to the /meta/connect channel.
   * This value is merely informative for clients. Bayeux servers SHOULD honor
   * timeout advices sent by clients.
   */
  timeout: 30000,

  /**
   * The maximum number of milliseconds to wait before considering a
   * request to the Bayeux server failed.
   */
  maxNetworkDelay: 30000,

  /**
   * The maximum number of milliseconds to wait for a WebSocket connection to
   * be opened. It does not apply to HTTP connections.
   */
   connectTimeout: 30000,

  /**
   * Maximum time to wait on disconnect
   */
  disconnectTimeout: 10000
});

function onMessage(message) {
  console.log('Incoming message', message);
}

/*
 *`.subscribe` returns a thenable with a `.unsubscribe` method
 * but will also resolve as a promise 
 */
var subscription = client.subscribe('/channel', onMessage);

subscription
  .then(function() {
    console.log('Subscription successful');
  })
  .catch(function(err) {
    console.log('Subscription failed: ', err);
  });

/** As an example, wait 10 seconds and cancel the subscription */
Promise.delay(10000)
  .then(function() {
    return subscription.unsubscribe();
  });
```


### Debugging

Halley uses [debug](https://github.com/visionmedia/debug) for debugging.

  * To enable in nodejs, `export DEBUG=halley:*`
  * To enable in a browser, `window.localStorage.debug='halley:*'`

To limit the amount of debug logging produced, you can specify individual categories, eg `export DEBUG=halley:client`.

## Tests

Most of the tests in Halley are end-to-end integration tests, which means running a server environment alongside client tests which run in the browser.

In order to isolate tests from one another, the server will spawn a new Faye server and Proxy server for each test (and tear them down when the test is complete). 

Some of the tests connect to Faye directly, while other tests are performed via the Proxy server which is intended to simulate an reverse-proxy/ELB situation common in many production environments.

The tests do horrible things in order to test some of the situations we've discovered when using Bayeux and websockets on the web. Examples of things we test to ensure that the client recovers include:

* Corrupting websocket streams, like bad MITM proxies sometimes do
* Dropping random packets
* Restarting the server during the test
* Deleting the client connection from the server during the test
* Not communicating TCP disconnects from the server-to-client and client-to-server when communicating via the proxy (a situation we've seen on ELB)

## License

(The MIT License)

Copyright (c) 2009-2014 James Coglan and contributors

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the 'Software'), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
