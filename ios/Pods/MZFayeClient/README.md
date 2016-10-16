MZFayeClient
===========

Faye Client for iOS. 
This project is a rewritten version of the library made by pcrawfor there: <https://github.com/pcrawfor/FayeObjC>
Improved capture errors, added subscription blocks, ability to set the extension for channel.
Added auto connection reconnect, and many more...

## How To Use - Example

```
self.client = [[MZFayeClient alloc] initWithURL:[NSURL URLWithString:@"ws://localhost:9292/faye"]];

[self.client subscribeToChannel:@"/server" success:^{
    NSLog(@"Subscribed successfully to 'server' channel!");
} failure:^(NSError *error) {
    NSLog(@"Error subscribing to 'server' channel: %@", error.userInfo);
} receivedMessage:^(NSDictionary *message) {
    NSLog(@"Message on 'server' channel: %@", message);
}];

[self.client subscribeToChannel:@"/browser" success:nil failure:nil receivedMessage:^(NSDictionary *message) {
    NSLog(@"Message on 'browser' channel: %@", message);
}];

[self.client connect:^{
    [self.client sendMessage:@{@"text": @"hello!"} toChannel:@"/server" success:^{
        NSLog(@"Message sent successfully.");
    } failure:^(NSError *error) {
        NSLog(@"Error sending message: %@", error.userInfo);
    }];
} failure:^(NSError *error) {
    NSLog(@"Error connecting: %@", error.userInfo);
}];
```

## Available methods

### Initializing
```
- (instancetype)initWithURL:(NSURL *)url;
+ (instancetype)clientWithURL:(NSURL *)url;
```

### Publishing
```
- (void)sendMessage:(NSDictionary *)message toChannel:(NSString *)channel success:(MZFayeClientSuccessHandler)successHandler failure:(MZFayeClientFailureHandler)failureHandler;
- (void)sendMessage:(NSDictionary *)message toChannel:(NSString *)channel usingExtension:(NSDictionary *)extension success:(MZFayeClientSuccessHandler)successHandler failure:(MZFayeClientFailureHandler)failureHandler;
```

### Subscribing/unsubscribing
```
- (void)subscribeToChannel:(NSString *)channel success:(MZFayeClientSuccessHandler)successHandler failure:(MZFayeClientFailureHandler)failureHandler receivedMessage:(MZFayeClientSubscriptionHandler)subscriptionHandler;
- (void)unsubscribeFromChannel:(NSString *)channel success:(MZFayeClientSuccessHandler)successHandler failure:(MZFayeClientFailureHandler)failureHandler;
```

### Connecting/disconnecting
```
- (void)connect:(MZFayeClientSuccessHandler)successHandler failure:(MZFayeClientFailureHandler)failureHandler;
- (void)disconnect:(MZFayeClientSuccessHandler)successHandler failure:(MZFayeClientFailureHandler)failureHandler;
```

### Using Faye extensions

For more info about extensions, see the [Faye site](http://faye.jcoglan.com/node/extensions.html),

```
- (void)setExtension:(NSDictionary *)extension forChannel:(NSString *)channel;
- (void)removeExtensionForChannel:(NSString *)channel;
```

## Delegate protocol

Many delegate methods can be accomplished with blocks instead, but they still exist for those who prefer this way.

**Note:** In `-connect:failure:`, the `successHandler` and `failureHandlers` will only be called the first time the connection succeeds or fails. Due to automatic reconnection logic, such events may happen multiple times. If you need to handle connection success or failure every time it happens, you should use the delegate methods instead (or in addition).

```
@protocol MZFayeClientDelegate <NSObject>
@optional

- (void)fayeClient:(MZFayeClient *)client didConnectToURL:(NSURL *)url;
- (void)fayeClient:(MZFayeClient *)client didDisconnectWithError:(NSError *)error;
- (void)fayeClient:(MZFayeClient *)client didUnsubscribeFromChannel:(NSString *)channel;
- (void)fayeClient:(MZFayeClient *)client didSubscribeToChannel:(NSString *)channel;
- (void)fayeClient:(MZFayeClient *)client didFailWithError:(NSError *)error;
- (void)fayeClient:(MZFayeClient *)client didFailDeserializeMessage:(NSDictionary *)message
         withError:(NSError *)error;
- (void)fayeClient:(MZFayeClient *)client didReceiveMessage:(NSDictionary *)messageData fromChannel:(NSString *)channel;

@end
```

## Faye Server
If you can to run a Faye server to test the client, you can find all the information you need there: <http://faye.jcoglan.com/>
You can also run the `faye.rb` file under the `Server` directory:

```
gem install faye thin eventmachine

rackup faye.ru -s thin -E production
```

```
curl http://localhost:9292/faye -d 'message={"channel":"/server", "data":"hello"}'
```

## Dependencies

#### SocketRocket
A conforming WebSocket (RFC 6455) client library maintained by Square, 
<https://github.com/square/SocketRocket>

#### Base64
Objective-C Base64 Additions for NSData and NSString
<https://github.com/ekscrypto/Base64>

## Requirements

MZFayeClient requires either iOS 6.x and above.

## ARC

MZFayeClient uses ARC.

## Contact

[Michal Zaborowski](http://github.com/m1entus)

[Twitter](https://twitter.com/iMientus) 



[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/m1entus/mzfayeclient/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

