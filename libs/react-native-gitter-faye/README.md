## react-native-gitter-faye

#### example
```
FayeGitter.setAccessToken('token')
FayeGitter.create()

FayeGitter.connect().then(() => {
  FayeGitter.subscribe('/api/v1/user/555e610f15522ed4b3e0c169/rooms')
  FayeGitter.logger()  
})

// events
FayeGitter:onDisconnected
FayeGitter:onFailedToCreate
FayeGitter:Message
FayeGitter:SubscribtionFailed
FayeGitter:Subscribed
FayeGitter:Unsubscribed
FayeGitter:log
```
