//
//  MZFayeClient.h
//  MZFayeClient
//
//  Created by Michał Zaborowski on 12.12.2013.
//  Copyright (c) 2013 Michał Zaborowski. All rights reserved.
//
//  Permission is hereby granted, free of charge, to any person obtaining a copy
//  of this software and associated documentation files (the "Software"), to deal
//  in the Software without restriction, including without limitation the rights
//  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
//  copies of the Software, and to permit persons to whom the Software is
//  furnished to do so, subject to the following conditions:
//
//  The above copyright notice and this permission notice shall be included in
//  all copies or substantial portions of the Software.
//
//  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
//  THE SOFTWARE.

#import <Foundation/Foundation.h>
#import <SocketRocket/SRWebSocket.h>

@class MZFayeClient;

extern NSString *const MZFayeClientBayeuxChannelHandshake;
extern NSString *const MZFayeClientBayeuxChannelConnect;
extern NSString *const MZFayeClientBayeuxChannelDisconnect;
extern NSString *const MZFayeClientBayeuxChannelSubscribe;
extern NSString *const MZFayeClientBayeuxChannelUnsubscribe;

extern NSString *const MZFayeClientWebSocketErrorDomain;
extern NSString *const MZFayeClientBayeuxErrorDomain;
extern NSString *const MZFayeClientErrorDomain;

typedef NS_ENUM(NSInteger, MZFayeClientBayeuxError) {
    MZFayeClientBayeuxErrorReceivedFailureStatus = -100,
    MZFayeClientBayeuxErrorCouldNotParse = -101,
};

typedef NS_ENUM(NSInteger, MZFayeClientError) {
    MZFayeClientErrorAlreadySubscribed,
    MZFayeClientErrorNotSubscribed,
};

extern NSTimeInterval const MZFayeClientDefaultRetryInterval;
extern NSInteger      const MZFayeClientDefaultMaximumAttempts;

typedef void(^MZFayeClientSubscriptionHandler)(NSDictionary *message, NSDictionary *extension);

typedef void (^MZFayeClientSuccessHandler)(NSDictionary *extension);
typedef void (^MZFayeClientFailureHandler)(NSError *error);

@protocol MZFayeClientDelegate <NSObject>
@optional

- (void)fayeClient:(MZFayeClient *)client didConnectToURL:(NSURL *)url extension:(NSDictionary *)extension;
- (void)fayeClient:(MZFayeClient *)client didDisconnectWithError:(NSError *)error;
- (void)fayeClient:(MZFayeClient *)client didUnsubscribeFromChannel:(NSString *)channel extension:(NSDictionary *)extension;
- (void)fayeClient:(MZFayeClient *)client didSubscribeToChannel:(NSString *)channel extension:(NSDictionary *)extension;
- (void)fayeClient:(MZFayeClient *)client didFailWithError:(NSError *)error;
- (void)fayeClient:(MZFayeClient *)client didFailDeserializeMessage:(NSDictionary *)message
         withError:(NSError *)error;
- (void)fayeClient:(MZFayeClient *)client didReceiveMessage:(NSDictionary *)messageData fromChannel:(NSString *)channel extension:(NSDictionary *)extension;

@end

@interface MZFayeClient : NSObject <SRWebSocketDelegate>

/**
 *  WebSocket client
 */
@property (nonatomic, readonly, strong) SRWebSocket *webSocket;

/**
 *  The URL for the faye server
 */
@property (nonatomic, readonly, strong) NSURL *url;

/**
 *  Uniquely identifies a client to the Bayeux server.
 */
@property (nonatomic, readonly, strong) NSString *clientId;

/**
 *  The number of sent messages
 */
@property (nonatomic, readonly) NSInteger sentMessageCount;

/**
 * Returns whether the faye client is connected to server
 */
@property (nonatomic, readonly, assign, getter = isConnected) BOOL connected;

/**
 *  The channels the client wishes to subscribe
 */
@property (nonatomic, readonly) NSSet *subscriptions;

@property (nonatomic, readonly) NSSet *pendingSubscriptions;
@property (nonatomic, readonly) NSSet *openSubscriptions;

/**
 *  Returns list of extensions per channel.
 *  The contents of ext may be arbitrary values that allow extensions to be negotiated 
 *  and implemented between server and client implementations.
 */
@property (nonatomic, readonly) NSDictionary *extensions;

/**
 * Returns whether the faye client should auto retry connection
 * By default, this is YES
 */
@property (nonatomic, assign) BOOL shouldRetryConnection;

/**
 * How often should retry connection
 */
@property (nonatomic, assign) NSTimeInterval retryInterval;

/**
 * Actual retry connection attempt number
 */
@property (nonatomic, assign) NSInteger retryAttempt;

/**
 * Maximum retry connection attments
 */
@property (nonatomic, assign) NSInteger maximumRetryAttempts;

/**
 *  The object that acts as the delegate of the receiving faye client events.
 */
@property (nonatomic, weak) id <MZFayeClientDelegate> delegate;

- (instancetype)initWithURL:(NSURL *)url;
+ (instancetype)clientWithURL:(NSURL *)url;

- (void)setExtension:(NSDictionary *)extension forChannel:(NSString *)channel;
- (void)removeExtensionForChannel:(NSString *)channel;

- (void)sendMessage:(NSDictionary *)message toChannel:(NSString *)channel success:(MZFayeClientSuccessHandler)successHandler failure:(MZFayeClientFailureHandler)failureHandler;
- (void)sendMessage:(NSDictionary *)message toChannel:(NSString *)channel usingExtension:(NSDictionary *)extension success:(MZFayeClientSuccessHandler)successHandler failure:(MZFayeClientFailureHandler)failureHandler;

- (void)subscribeToChannel:(NSString *)channel success:(MZFayeClientSuccessHandler)successHandler failure:(MZFayeClientFailureHandler)failureHandler receivedMessage:(MZFayeClientSubscriptionHandler)subscriptionHandler;
- (void)unsubscribeFromChannel:(NSString *)channel success:(MZFayeClientSuccessHandler)successHandler failure:(MZFayeClientFailureHandler)failureHandler;

- (void)connect:(MZFayeClientSuccessHandler)successHandler failure:(MZFayeClientFailureHandler)failureHandler;

- (void)disconnect:(MZFayeClientSuccessHandler)successHandler failure:(MZFayeClientFailureHandler)failureHandler;

@end
