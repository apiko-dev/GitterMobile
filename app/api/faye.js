import Faye from 'faye'
const noop = () => {}

class ClientAuthExt {
  constructor(token) {
    this._token = token
  }

  outgoing(message, cb) {
    if (message.channel === '/meta/handshake') {
      if (!message.ext) { message.ext = {}; }
      message.ext.token = this._token;
    }

    cb(message);
  }

  incoming(message, cb) {
    if (message.channel === '/meta/handshake') {
      if (message.successful) {
        console.log('Successfuly subscribed: ', message);
      } else {
        console.log('Something went wrong: ', message.error);
      }
    }

    cb(message)
  }
}

class LogExt {
  outgoing(message, cb) {
    console.log('Log outgoing message: ', message)
    cb(message)
  }

  incoming(message, cb) {
    console.log('Log incoming message: ', message)
    cb(message)
  }
}

class SnapshotExt {
  constructor(fn) {
    this._handler = fn
  }
  incoming(message, cb) {
    if (message.channel === '/meta/subscribe' && message.ext && message.ext.snapshot) {
      this._handler(message)
    }

    cb(message)
  }
}


export default class HalleyClient {
  constructor({token, snapshotHandler}) {
    this._client = new Faye.Client('https://ws.gitter.im/faye', {
      timeout: 60,
      retry: 1,
      interval: 0
    })
    this._token = token
    this._snapshotHandler = snapshotHandler
    this._subsciptions = []
  }

  setToken(token) {
    this._token = token
  }

  setSnapshotHandler(fn) {
    this._snapshotHandler = fn
  }

  setup() {
    if (!this._token) {
      throw new Error('You need to add token')
    }

    this._snapshotExt = new SnapshotExt(this._snapshotHandler || noop)
    this._authExt = new ClientAuthExt(this._token)
  }

  create() {
    if (!this._token) {
      throw new Error('You need to add token')
    }
    this._client.addExtension(this._authExt)
    this._client.addExtension(this._snapshotExt)
    this._client.addExtension(new LogExt())
  }

  subscribe({type, url, handler}) {
    return new Promise((res, rej) => {
      if (this._checkSubscriptionAlreadyExist({type, url})) {
        rej(`Subscription with type ${type} and url ${url} already exist.`)
      }

      const subscriptionObject = this._client.subscribe(url, handler)

      subscriptionObject
        .then(() => {
          this._subsciptions.push({
            type,
            url,
            handler,
            subscriptionObject
          })
          res(true)
        })
        // .catch(err => {
        //   rej(err)
        // })
    })
  }

  unsubscribe({type, url}) {
    return new Promise((res, rej) => {
      const subscription = this._findSubscription({type, url})
      if (!subscription) {
        rej(`There is no subscription with type ${type} and url ${url}`)
      } else {
        subscription.subscriptionObject.unsubscribe()
          .then(() => {
            this._removeSubscription(subscription)
            res(true)
          })
          // .catch(err => rej(err))
      }
    })
  }

  _checkSubscriptionAlreadyExist(subscriptionOptions) {
    const subscription = this._findSubscription(subscriptionOptions)
    return !!subscription
  }

  _findSubscription({type, url}) {
    return this._subsciptions.find(
      item => item.type === type && item.url === url
    )
  }

  _removeSubscription({type, url}) {
    const index = this._subsciptions.indexOf(
      item => item.type === type && item.url === url
    )

    if (index !== -1) {
      this._subsciptions.splice(index, 1)
    }
  }
}
