//
//  MZFayeClient.m
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

#import "MZFayeClient.h"
#import "MZFayeMessage.h"

NSString *const MZFayeClientBayeuxChannelHandshake = @"/meta/handshake";
NSString *const MZFayeClientBayeuxChannelConnect = @"/meta/connect";
NSString *const MZFayeClientBayeuxChannelDisconnect = @"/meta/disconnect";
NSString *const MZFayeClientBayeuxChannelSubscribe = @"/meta/subscribe";
NSString *const MZFayeClientBayeuxChannelUnsubscribe = @"/meta/unsubscribe";

NSString *const MZFayeClientBayeuxMessageChannelKey = @"channel";
NSString *const MZFayeClientBayeuxMessageClientIdKey = @"clientId";
NSString *const MZFayeClientBayeuxMessageIdKey = @"id";
NSString *const MZFayeClientBayeuxMessageDataKey = @"data";
NSString *const MZFayeClientBayeuxMessageSubscriptionKey = @"subscription";
NSString *const MZFayeClientBayeuxMessageExtensionKey = @"ext";
NSString *const MZFayeClientBayeuxMessageVersionKey = @"version";
NSString *const MZFayeClientBayeuxMessageMinimuVersionKey = @"minimumVersion";
NSString *const MZFayeClientBayeuxMessageSupportedConnectionTypesKey = @"supportedConnectionTypes";
NSString *const MZFayeClientBayeuxMessageConnectionTypeKey = @"connectionType";

NSString *const MZFayeClientBayeuxVersion = @"1.0";
NSString *const MZFayeClientBayeuxMinimumVersion = @"1.0beta";

NSString *const MZFayeClientBayeuxConnectionTypeLongPolling = @"long-polling";
NSString *const MZFayeClientBayeuxConnectionTypeCallbackPolling = @"callback-polling";
NSString *const MZFayeClientBayeuxConnectionTypeIFrame = @"iframe";
NSString *const MZFayeClientBayeuxConnectionTypeWebSocket = @"websocket";

NSString *const MZFayeClientWebSocketErrorDomain = @"com.mzfayeclient.error.web-socket";
NSString *const MZFayeClientBayeuxErrorDomain = @"com.mzfayeclient.error.bayeux";
NSString *const MZFayeClientErrorDomain = @"com.mzfayeclient.error";

NSTimeInterval const MZFayeClientDefaultRetryInterval = 1.0f;
NSInteger const MZFayeClientDefaultMaximumAttempts = 5;

@interface MZFayeClient ()
@property (nonatomic, readwrite, strong) SRWebSocket *webSocket;

@property (nonatomic, readwrite, strong) NSMutableSet *openChannelSubscriptions;
@property (nonatomic, readwrite, strong) NSMutableSet *pendingChannelSubscriptions;
@property (nonatomic, readwrite, strong) NSDictionary *connectHandlers;
@property (nonatomic, readwrite, strong) NSDictionary *disconnectHandlers;
@property (nonatomic, readwrite, strong) NSMutableDictionary *channelSubscribeHandlers;
@property (nonatomic, readwrite, strong) NSMutableDictionary *channelUnsubscribeHandlers;
@property (nonatomic, readwrite, strong) NSMutableDictionary *channelReceivedMessageHandlers;
@property (nonatomic, readwrite, strong) NSMutableDictionary *sendMessageHandlers;
@property (nonatomic, readwrite, strong) NSMutableDictionary *channelExtensions;

@property (nonatomic, readwrite, strong) NSString *clientId;

@property (nonatomic, strong) NSTimer *reconnectTimer;

@property (nonatomic, readwrite, assign) NSInteger sentMessageCount;

@property (nonatomic, readwrite, assign, getter = isConnected) BOOL connected;

@property (nonatomic, readonly, assign, getter = isWebSocketOpen) BOOL webSocketOpen;
@property (nonatomic, readonly, assign, getter = isWebSocketClosed) BOOL webSocketClosed;
@end

@implementation MZFayeClient

#pragma mark - Getters

- (NSSet *)subscriptions
{
    return [NSSet setWithArray:[self.channelReceivedMessageHandlers allKeys]];
}

- (NSSet *)pendingSubscriptions
{
    return [self.pendingChannelSubscriptions copy];
}

- (NSSet *)openSubscriptions
{
    return [self.openChannelSubscriptions copy];
}

- (NSDictionary *)extensions
{
    return [self.channelExtensions copy];
}

- (BOOL)isWebSocketOpen
{
    if (!self.webSocket)
        return NO;
    
    return self.webSocket.readyState == SR_OPEN;
}

- (BOOL)isWebSocketClosed
{
    if (!self.webSocket)
        return YES;
    
    return self.webSocket.readyState == SR_CLOSED;
}

#pragma mark - Dealloc

- (void)dealloc
{
    [self.channelReceivedMessageHandlers removeAllObjects];
    
    [self clearSubscriptions];
    
    [self invalidateReconnectTimer];
    [self disconnectFromWebSocket];
}

#pragma mark - Initializers

- (instancetype)init
{
    if (self = [super init]) {
        [NSException raise:@"MZFayeClient" format:@"Use -initWithURL:"];
    }
    return self;
}

- (instancetype)initWithURL:(NSURL *)url
{
    if (self = [super init]) {
        _channelExtensions = [NSMutableDictionary dictionary];
        _channelSubscribeHandlers = [NSMutableDictionary dictionary];
        _channelUnsubscribeHandlers = [NSMutableDictionary dictionary];
        _channelReceivedMessageHandlers = [NSMutableDictionary dictionary];
        _sendMessageHandlers = [NSMutableDictionary dictionary];
        _pendingChannelSubscriptions = [NSMutableSet set];
        _openChannelSubscriptions = [NSMutableSet set];
        _maximumRetryAttempts = MZFayeClientDefaultMaximumAttempts;
        _retryInterval = MZFayeClientDefaultRetryInterval;
        _shouldRetryConnection = YES;
        _sentMessageCount = 0;
        _retryAttempt = 0;
        
        _url = url;
    }
    return self;
}

+ (instancetype)clientWithURL:(NSURL *)url
{
    return [[[self class] alloc] initWithURL:url];
}

#pragma mark - Bayeux procotol messages

/**
 *  A handshake request MUST contain the message fields:
 *
 *  channel - value "/meta/handshake"
 *  version - The version of the protocol supported by the client.
 *
 *  supportedConnectionTypes -  An array of the connection types supported by the client for
 *  the purposes of the connection being negotiated (see section 3.4). This list MAY be a subset
 *  of the connection types actually supported if the client wishes to negotiate a specific connection type.
 */
- (void)sendBayeuxHandshakeMessage
{
    NSArray *supportedConnectionTypes = @[MZFayeClientBayeuxConnectionTypeLongPolling,
                                          MZFayeClientBayeuxConnectionTypeCallbackPolling,
                                          MZFayeClientBayeuxConnectionTypeIFrame,
                                          MZFayeClientBayeuxConnectionTypeWebSocket];
    
    NSDictionary *message = @{MZFayeClientBayeuxMessageChannelKey : MZFayeClientBayeuxChannelHandshake,
                              MZFayeClientBayeuxMessageVersionKey : MZFayeClientBayeuxVersion,
                              MZFayeClientBayeuxMessageMinimuVersionKey : MZFayeClientBayeuxMinimumVersion,
                              MZFayeClientBayeuxMessageSupportedConnectionTypesKey : supportedConnectionTypes
                              };
    
    message = [self appendExtensionToMessage:message channel:MZFayeClientBayeuxChannelHandshake];
    
    [self writeMessageToWebSocket:message];
}

/**
 *  A connect request MUST contain the message fields:
 *  channel - value "/meta/connect"
 *  clientId - The client ID returned in the handshake response
 *  connectionType - The connection type used by the client for the purposes of this connection.
 */
- (void)sendBayeuxConnectMessage
{
    NSDictionary *message = @{MZFayeClientBayeuxMessageChannelKey : MZFayeClientBayeuxChannelConnect,
                              MZFayeClientBayeuxMessageClientIdKey : self.clientId,
                              MZFayeClientBayeuxMessageConnectionTypeKey : MZFayeClientBayeuxConnectionTypeWebSocket
                              };
    
    message = [self appendExtensionToMessage:message channel:MZFayeClientBayeuxChannelConnect];
    
    [self writeMessageToWebSocket:message];
}

/**
 *  A connect request MUST contain the message fields:
 *  channel - value "/meta/connect"
 *  clientId - The client ID returned in the handshake response
 */
- (void)sendBayeuxDisconnectMessage
{
    NSDictionary *message = @{MZFayeClientBayeuxMessageChannelKey : MZFayeClientBayeuxChannelDisconnect,
                              MZFayeClientBayeuxMessageClientIdKey : self.clientId
                              };
    
    message = [self appendExtensionToMessage:message channel:MZFayeClientBayeuxChannelDisconnect];
    
    [self writeMessageToWebSocket:message];
}

/**
 * A subscribe request MUST contain the message fields:
 * channel - value "/meta/subscribe"
 * clientId - The client ID returned in the handshake response
 * subscription - a channel name or a channel pattern or an array of channel names and channel patterns.
 */
- (void)sendBayeuxSubscribeMessageWithChannel:(NSString *)channel
{
    NSMutableDictionary *message = @{
                                     MZFayeClientBayeuxMessageChannelKey : MZFayeClientBayeuxChannelSubscribe,
                                     MZFayeClientBayeuxMessageClientIdKey : self.clientId,
                                     MZFayeClientBayeuxMessageSubscriptionKey : channel
                                     };
    
    message = [self appendExtensionToMessage:message channel:MZFayeClientBayeuxChannelSubscribe];
    
    [self writeMessageToWebSocket:message];
    
    [self.pendingChannelSubscriptions addObject:channel];
}

/**
 * An unsubscribe request MUST contain the message fields:
 * channel - value "/meta/unsubscribe"
 * clientId - The client ID returned in the handshake response
 * subscription - a channel name or a channel pattern or an array of channel names and channel patterns.
 */
- (void)sendBayeuxUnsubscribeMessageWithChannel:(NSString *)channel
{
    NSDictionary *message = @{
                              MZFayeClientBayeuxMessageChannelKey : MZFayeClientBayeuxChannelUnsubscribe,
                              MZFayeClientBayeuxMessageClientIdKey : self.clientId,
                              MZFayeClientBayeuxMessageSubscriptionKey : channel
                              };
    
    [self appendExtensionToMessage:message channel:MZFayeClientBayeuxChannelUnsubscribe];
    
    [self writeMessageToWebSocket:message];
}

/**
 *  A publish event message MUST contain the message fields:
 *  channel
 *  data - The message as an arbitrary JSON encoded object
 */
- (void)sendBayeuxPublishMessage:(NSDictionary *)messageDictionary toChannel:(NSString *)channel usingExtension:(NSDictionary *)extension success:(MZFayeClientSuccessHandler)successHandler failure:(MZFayeClientFailureHandler)failureHandler
{
    if (!(self.isConnected && self.isWebSocketOpen)) {
        [self didFailWithMessage:@"FayeClient not connected to server."];
        return;
    }
    
    NSString *messageId = [self generateUniqueMessageId];
    
    NSMutableDictionary *message = [@{
                                      MZFayeClientBayeuxMessageChannelKey : channel,
                                      MZFayeClientBayeuxMessageClientIdKey : self.clientId,
                                      MZFayeClientBayeuxMessageDataKey : messageDictionary,
                                      MZFayeClientBayeuxMessageIdKey : messageId
                                      } mutableCopy];
    
    if (extension) {
        [message setObject:extension forKey:MZFayeClientBayeuxMessageExtensionKey];
    } else {
        message = [[self appendExtensionToMessage:message channel:channel] mutableCopy];
    }
    
    NSMutableDictionary *handlers = [NSMutableDictionary dictionaryWithCapacity:2];
    if (successHandler != nil) handlers[@YES] = [successHandler copy];
    if (failureHandler != nil) handlers[@NO] = [failureHandler copy];
    self.sendMessageHandlers[messageId] = [NSDictionary dictionaryWithDictionary:handlers];
    
    [self writeMessageToWebSocket:[message copy]];
    
}

- (void)clearSubscriptions
{
    [self.pendingChannelSubscriptions removeAllObjects];
    [self.openChannelSubscriptions removeAllObjects];
}

#pragma mark - Helper methods

- (NSString *)generateUniqueMessageId
{
    self.sentMessageCount++;
    
    return [[[NSString stringWithFormat:@"%ld", (long)self.sentMessageCount] dataUsingEncoding:NSUTF8StringEncoding] base64EncodedStringWithOptions:0];
}

- (NSArray *)channelsWithWildcardsForChannel:(NSString *)channel
{
    static NSCharacterSet *separator = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        separator = [NSCharacterSet characterSetWithCharactersInString:@"/"];
    });
    
    NSArray *segments = [channel componentsSeparatedByCharactersInSet:separator];
    if (segments.count < 2)
        return @[];
    
    NSMutableArray *wildcards = [NSMutableArray arrayWithCapacity:segments.count];
    NSMutableString *wildcard = [NSMutableString new];
    
    [wildcards addObject:@"/**"];
    
    for (NSInteger i = 1, count = segments.count - 1; i < count; ++i) {
        NSString* segment = segments[i];
        
        [wildcard appendFormat:@"/%@", segment];
        [wildcards addObject:[wildcard stringByAppendingString:@"/**"]];
    }
    
    [wildcards addObject:[wildcard stringByAppendingString:@"/*"]];
    [wildcards addObject:channel];
    return [wildcards copy];
}

- (NSDictionary *)appendExtensionToMessage:(NSDictionary *)message channel:(NSString *)channel {
    NSDictionary *extension = self.channelExtensions[channel];
    if (extension) {
        NSMutableDictionary *result = [message mutableCopy];
        [result setObject:extension forKey:MZFayeClientBayeuxMessageExtensionKey];
        return [result copy];
    }
    else {
        return message;
    }
}

#pragma mark - Public methods

- (void)setExtension:(NSDictionary *)extension forChannel:(NSString *)channel
{
    [self.channelExtensions setObject:extension forKey:channel];
}
- (void)removeExtensionForChannel:(NSString *)channel
{
    [self.channelExtensions removeObjectForKey:channel];
}

- (void)sendMessage:(NSDictionary *)message toChannel:(NSString *)channel
{
    [self sendBayeuxPublishMessage:message toChannel:channel usingExtension:nil success:nil failure:nil];
}

- (void)sendMessage:(NSDictionary *)message toChannel:(NSString *)channel success:(MZFayeClientSuccessHandler)successHandler failure:(MZFayeClientFailureHandler)failureHandler
{
    [self sendBayeuxPublishMessage:message toChannel:channel usingExtension:nil success:successHandler failure:failureHandler];
}

- (void)sendMessage:(NSDictionary *)message toChannel:(NSString *)channel usingExtension:(NSDictionary *)extension
{
    [self sendBayeuxPublishMessage:message toChannel:channel usingExtension:extension success:nil failure:nil];
}

- (void)sendMessage:(NSDictionary *)message toChannel:(NSString *)channel usingExtension:(NSDictionary *)extension success:(MZFayeClientSuccessHandler)successHandler failure:(MZFayeClientFailureHandler)failureHandler
{
    [self sendBayeuxPublishMessage:message toChannel:channel usingExtension:extension success:successHandler failure:failureHandler];
}

- (BOOL)connectToURL:(NSURL *)url
{
    if (self.isConnected || self.isWebSocketOpen) {
        return NO;
    }
    
    _url = url;
    return [self connect];
}

- (BOOL)connect
{
    if (self.isConnected || self.isWebSocketOpen) {
        return NO;
    }
    
    [self connect:nil failure:nil];
    
    return YES;
}

- (void)connect:(MZFayeClientSuccessHandler)successHandler failure:(MZFayeClientFailureHandler)failureHandler
{
    if (self.isConnected || self.isWebSocketOpen) {
        if (successHandler) successHandler(nil);
        return;
    }
    
    NSMutableDictionary *handlers = [NSMutableDictionary dictionaryWithCapacity:2];
    if (successHandler != nil) handlers[@YES] = [successHandler copy];
    if (failureHandler != nil) handlers[@NO] = [failureHandler copy];
    self.connectHandlers = [NSDictionary dictionaryWithDictionary:handlers];
    
    [self connectToWebSocket];
}

- (void)disconnect
{
    [self disconnect:nil failure:nil];
}

- (void)disconnect:(MZFayeClientSuccessHandler)successHandler failure:(MZFayeClientFailureHandler)failureHandler
{
    NSMutableDictionary *handlers = [NSMutableDictionary dictionaryWithCapacity:2];
    if (successHandler != nil) handlers[@YES] = [successHandler copy];
    if (failureHandler != nil) handlers[@NO] = [failureHandler copy];
    self.disconnectHandlers = [NSDictionary dictionaryWithDictionary:handlers];
    
    [self sendBayeuxDisconnectMessage];
}

- (void)subscribeToChannel:(NSString *)channel
{
    [self subscribeToChannel:channel usingBlock:nil];
}

- (void)subscribeToChannel:(NSString *)channel usingBlock:(MZFayeClientSubscriptionHandler)subscriptionHandler
{
    [self subscribeToChannel:channel success:nil failure:nil receivedMessage:subscriptionHandler];
}

- (void)subscribeToChannel:(NSString *)channel success:(MZFayeClientSuccessHandler)successHandler failure:(MZFayeClientFailureHandler)failureHandler receivedMessage:(MZFayeClientSubscriptionHandler)subscriptionHandler
{
    NSAssert(channel != nil, @"channel must not be nil");
    
    if (subscriptionHandler && self.channelReceivedMessageHandlers[channel] && channel) {
        self.channelReceivedMessageHandlers[channel] = subscriptionHandler;
        
    } else if (self.channelReceivedMessageHandlers[channel]) {
        NSString *domain = MZFayeClientErrorDomain;
        NSInteger code = MZFayeClientErrorAlreadySubscribed;
        NSError *error = [NSError errorWithDomain:domain code:code userInfo:@{NSLocalizedDescriptionKey: @"The operation could not be completed", NSLocalizedFailureReasonErrorKey: [NSString stringWithFormat:@"%@ #%ld", domain, (long)code]}];
        if (failureHandler != nil) failureHandler(error);
        
        return;
    }
    
    NSMutableDictionary *handlers = [NSMutableDictionary dictionaryWithCapacity:2];
    if (successHandler != nil) handlers[@YES] = [successHandler copy];
    if (failureHandler != nil) handlers[@NO] = [failureHandler copy];
    self.channelSubscribeHandlers[channel] = [NSDictionary dictionaryWithDictionary:handlers];
    
    if (subscriptionHandler) {
        [self.channelReceivedMessageHandlers setObject:subscriptionHandler forKey:channel];
    } else {
        [self.channelReceivedMessageHandlers setObject:[NSNull null] forKey:channel];
    }
    
    if (self.isConnected) {
        [self sendBayeuxSubscribeMessageWithChannel:channel];
    }
}

- (void)unsubscribeFromChannel:(NSString *)channel
{
    [self unsubscribeFromChannel:channel success:nil failure:nil];
}

- (void)unsubscribeFromChannel:(NSString *)channel success:(MZFayeClientSuccessHandler)successHandler failure:(MZFayeClientFailureHandler)failureHandler
{
    NSAssert(channel != nil, @"channel must not be nil");
    
    if (!self.channelReceivedMessageHandlers[channel]) {
        NSString *domain = MZFayeClientErrorDomain;
        NSInteger code = MZFayeClientErrorNotSubscribed;
        NSError *error = [NSError errorWithDomain:domain code:code userInfo:@{NSLocalizedDescriptionKey: @"The operation could not be completed", NSLocalizedFailureReasonErrorKey: [NSString stringWithFormat:@"%@ #%ld", domain, (long)code]}];
        if (failureHandler != nil) failureHandler(error);
        
        return;
    }
    
    NSMutableDictionary *handlers = [NSMutableDictionary dictionaryWithCapacity:2];
    if (successHandler != nil) handlers[@YES] = [successHandler copy];
    if (failureHandler != nil) handlers[@NO] = [failureHandler copy];
    self.channelUnsubscribeHandlers[channel] = [NSDictionary dictionaryWithDictionary:handlers];
    
    [self.channelReceivedMessageHandlers removeObjectForKey:channel];
    [self.pendingChannelSubscriptions removeObject:channel];
    
    if (self.isConnected) {
        [self sendBayeuxUnsubscribeMessageWithChannel:channel];
    }
}

#pragma mark - Private methods

- (void)subscribePendingSubscriptions
{
    for (NSString *channel in self.channelReceivedMessageHandlers) {
        if (![self.pendingChannelSubscriptions containsObject:channel] && ![self.openChannelSubscriptions containsObject:channel]) {
            [self sendBayeuxSubscribeMessageWithChannel:channel];
        }
    }
}

- (void)reconnectTimer:(NSTimer *)timer
{
    if (self.isConnected) {
        [self invalidateReconnectTimer];
    } else {
        if (self.shouldRetryConnection && self.retryAttempt < self.maximumRetryAttempts) {
            self.retryAttempt++;
            [self connect:nil failure:nil];
        } else {
            [self invalidateReconnectTimer];
        }
    }
}

- (void)invalidateReconnectTimer
{
    [self.reconnectTimer invalidate];
    self.reconnectTimer = nil;
}

- (void)reconnect
{
    if (self.shouldRetryConnection && self.retryAttempt < self.maximumRetryAttempts) {
        
        self.reconnectTimer = [NSTimer scheduledTimerWithTimeInterval:self.retryInterval target:self selector:@selector(reconnectTimer:) userInfo:nil repeats:NO];
    }
}

#pragma mark - SRWebSocket

- (void)writeMessageToWebSocket:(NSDictionary *)object
{
    NSError *error = nil;
    NSData *jsonData = [NSJSONSerialization dataWithJSONObject:object options:0 error:&error];
    
    if (error) {
        if ([self.delegate respondsToSelector:@selector(fayeClient:didFailDeserializeMessage:withError:)]) {
            [self.delegate fayeClient:self didFailDeserializeMessage:object withError:error];
        }
    } else {
        NSString *JSON = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
        [self.webSocket send:JSON];
    }
}

- (void)connectToWebSocket
{
    [self disconnectFromWebSocket];
    
    NSURLRequest *request = [[NSURLRequest alloc] initWithURL:self.url];
    self.webSocket = [[SRWebSocket alloc] initWithURLRequest:request];
    self.webSocket.delegate = self;
    [self.webSocket open];
}

- (void)disconnectFromWebSocket
{
    self.webSocket.delegate = nil;
    [self.webSocket close];
    self.webSocket = nil;
}

- (void)didFailWithMessage:(NSString *)message
{
    if ([self.delegate respondsToSelector:@selector(fayeClient:didFailWithError:)] && message) {
        NSError *error = [NSError errorWithDomain:MZFayeClientBayeuxErrorDomain code:MZFayeClientBayeuxErrorReceivedFailureStatus userInfo:@{NSLocalizedDescriptionKey : message}];
        [self.delegate fayeClient:self didFailWithError:error];
    }
}

#pragma mark - Message handling

- (void)handleFayeMessages:(NSArray *)messages
{
    for (NSDictionary *message in messages) {
        
        if (![message isKindOfClass:[NSDictionary class]]) {
            if ([self.delegate respondsToSelector:@selector(fayeClient:didFailWithError:)]) {
                NSError *error = [NSError errorWithDomain:MZFayeClientBayeuxErrorDomain code:MZFayeClientBayeuxErrorCouldNotParse userInfo:@{NSLocalizedDescriptionKey : @"Message is not kind of NSDicitionary class"}];
                [self.delegate fayeClient:self didFailWithError:error];
            }
            return;
        }
        
        MZFayeMessage *fayeMessage = [MZFayeMessage messageFromDictionary:message];
        
        if ([fayeMessage.channel isEqualToString:MZFayeClientBayeuxChannelHandshake]) {
            
            [self handleChannelHandshake:fayeMessage];
            
        } else if ([fayeMessage.channel isEqualToString:MZFayeClientBayeuxChannelConnect]) {
            
            [self handleChannelConnect:fayeMessage];
            
        } else if ([fayeMessage.channel isEqualToString:MZFayeClientBayeuxChannelDisconnect]) {
            
            [self handleChannelDisconnect:fayeMessage];
            
        } else if ([fayeMessage.channel isEqualToString:MZFayeClientBayeuxChannelSubscribe]) {
            
            [self handleChannelSubscribe:fayeMessage];
            
        } else if ([fayeMessage.channel isEqualToString:MZFayeClientBayeuxChannelUnsubscribe]) {
            
            [self handleChannelUnsubscribe:fayeMessage];
            
        } else if (self.sendMessageHandlers[fayeMessage.Id] && fayeMessage.successful != nil) {
            
            // This is a response to a message we published
            [self handleMessageResponse:fayeMessage];
        } else {
            
            NSArray *channelsWithWildcards = [self channelsWithWildcardsForChannel:fayeMessage.channel];
            for (NSString* channel in channelsWithWildcards) {
                if ([self.openChannelSubscriptions containsObject:channel]) {
                    [self handleChannelReceivedMessage:fayeMessage forChannel:channel];
                }
            }
        }
        
    }
}

- (void)handleChannelHandshake:(MZFayeMessage *)fayeMessage
{
    if ([fayeMessage.successful boolValue]) {
        self.retryAttempt = 0;
        
        self.clientId = fayeMessage.clientId;
        self.connected = YES;
        
        if ([self.delegate respondsToSelector:@selector(fayeClient:didConnectToURL:extension:)]) {
            [self.delegate fayeClient:self didConnectToURL:self.url extension:fayeMessage.ext];
        }
        [self sendBayeuxConnectMessage];
        [self subscribePendingSubscriptions];
        
        MZFayeClientSuccessHandler successHandler = self.connectHandlers[@YES];
        if (successHandler != nil) successHandler(fayeMessage.ext);
        
    } else {
        [self didFailWithMessage:[NSString stringWithFormat:@"Faye client couldn't handshake with server. %@",fayeMessage.error]];
        
        MZFayeClientFailureHandler failureHandler = self.connectHandlers[@NO];
        NSError *error = [NSError errorWithDomain:MZFayeClientBayeuxErrorDomain code:MZFayeClientBayeuxErrorReceivedFailureStatus userInfo:@{NSLocalizedDescriptionKey : fayeMessage.error}];
        
        if (failureHandler != nil) failureHandler(error);
    }
    
    self.connectHandlers = nil;
}

- (void)handleChannelConnect:(MZFayeMessage *)fayeMessage
{
    if ([fayeMessage.successful boolValue]) {
        self.connected = YES;
        [self sendBayeuxConnectMessage];
        
        // Note: success handler block is not called yet; we wait for handshake
    } else {
        [self didFailWithMessage:[NSString stringWithFormat:@"Faye client couldn't connect to server. %@",fayeMessage.error]];
        
        MZFayeClientFailureHandler failureHandler = self.connectHandlers[@NO];
        NSError *error = [NSError errorWithDomain:MZFayeClientBayeuxErrorDomain code:MZFayeClientBayeuxErrorReceivedFailureStatus userInfo:@{NSLocalizedDescriptionKey : fayeMessage.error}];
        
        if (failureHandler != nil) failureHandler(error);
        
        // Don't allow failure handshake to fire twice
        self.connectHandlers = nil;
    }
}

- (void)handleChannelDisconnect:(MZFayeMessage *)fayeMessage
{
    if ([fayeMessage.successful boolValue]) {
        [self disconnectFromWebSocket];
        
        self.connected = NO;
        [self clearSubscriptions];
        
        if ([self.delegate respondsToSelector:@selector(fayeClient:didDisconnectWithError:)]) {
            [self.delegate fayeClient:self didDisconnectWithError:nil];
        }
        
        MZFayeClientSuccessHandler successHandler = self.disconnectHandlers[@YES];
        if (successHandler != nil) successHandler(fayeMessage.ext);
    } else {
        [self didFailWithMessage:[NSString stringWithFormat:@"Faye client couldn't disconnect from server. %@",fayeMessage.error]];
        
        MZFayeClientFailureHandler failureHandler = self.disconnectHandlers[@NO];
        NSError *error = [NSError errorWithDomain:MZFayeClientBayeuxErrorDomain code:MZFayeClientBayeuxErrorReceivedFailureStatus userInfo:@{NSLocalizedDescriptionKey : fayeMessage.error}];
        
        if (failureHandler != nil) failureHandler(error);
    }
    
    self.disconnectHandlers = nil;
}

- (void)handleChannelSubscribe:(MZFayeMessage *)fayeMessage
{
    [self.pendingChannelSubscriptions removeObject:fayeMessage.subscription];
    
    NSDictionary *handlers = self.channelSubscribeHandlers[fayeMessage.subscription];
    
    if ([fayeMessage.successful boolValue]) {
        [self.openChannelSubscriptions addObject:fayeMessage.subscription];
        
        if ([self.delegate respondsToSelector:@selector(fayeClient:didSubscribeToChannel:extension:)]) {
            [self.delegate fayeClient:self didSubscribeToChannel:fayeMessage.subscription extension:fayeMessage.ext];
        }
        
        if (handlers[@YES] != nil) {
            MZFayeClientSuccessHandler successHandler = handlers[@YES];
            successHandler(fayeMessage.ext);
        }
    } else {
        [self didFailWithMessage:[NSString stringWithFormat:@"Faye client couldn't subscribe channel %@ with server. %@",fayeMessage.subscription, fayeMessage.error]];
        
        if (handlers[@NO] != nil) {
            MZFayeClientFailureHandler failureHandler = handlers[@NO];
            
            id fayeErrorOrNull = fayeMessage.error;
            if (fayeErrorOrNull == nil) fayeErrorOrNull = NSNull.null;
            NSError *error = [NSError errorWithDomain:MZFayeClientBayeuxErrorDomain code:MZFayeClientBayeuxErrorReceivedFailureStatus userInfo:@{NSLocalizedDescriptionKey : @"Faye server rejected subscribe attempt", NSLocalizedFailureReasonErrorKey: fayeErrorOrNull}];
            
            failureHandler(error);
        }
    }
    
    [self.channelSubscribeHandlers removeObjectForKey:fayeMessage.subscription];
}

- (void)handleChannelUnsubscribe:(MZFayeMessage *)fayeMessage
{
    NSDictionary *handlers = self.channelUnsubscribeHandlers[fayeMessage.subscription];
    
    if ([fayeMessage.successful boolValue]) {
        
        [self.channelReceivedMessageHandlers removeObjectForKey:fayeMessage.subscription];
        [self.pendingChannelSubscriptions removeObject:fayeMessage.subscription];
        [self.openChannelSubscriptions removeObject:fayeMessage.subscription];
        
        if ([self.delegate respondsToSelector:@selector(fayeClient:didUnsubscribeFromChannel:extension:)]) {
            [self.delegate fayeClient:self didUnsubscribeFromChannel:fayeMessage.subscription extension:fayeMessage.ext];
        }
        
        if (handlers[@YES] != nil) {
            MZFayeClientSuccessHandler successHandler = handlers[@YES];
            successHandler(fayeMessage.ext);
        }
    } else {
        [self didFailWithMessage:[NSString stringWithFormat:@"Faye client couldn't unsubscribe channel %@ with server. %@",fayeMessage.subscription, fayeMessage.error]];
        
        if (handlers[@NO] != nil) {
            MZFayeClientFailureHandler failureHandler = handlers[@NO];
            
            id fayeErrorOrNull = fayeMessage.error;
            if (fayeErrorOrNull == nil) fayeErrorOrNull = NSNull.null;
            NSError *error = [NSError errorWithDomain:MZFayeClientBayeuxErrorDomain code:MZFayeClientBayeuxErrorReceivedFailureStatus userInfo:@{NSLocalizedDescriptionKey : @"Faye server rejected unsubscribe attempt", NSLocalizedFailureReasonErrorKey: fayeErrorOrNull}];
            
            failureHandler(error);
        }
    }
    
    [self.channelUnsubscribeHandlers removeObjectForKey:fayeMessage.subscription];
}

- (void)handleMessageResponse:(MZFayeMessage *)fayeMessage
{
    NSDictionary *handlers = self.sendMessageHandlers[fayeMessage.Id];
    
    if ([fayeMessage.successful boolValue]) {
        if (handlers[@YES] != nil) {
            MZFayeClientSuccessHandler successHandler = handlers[@YES];
            successHandler(fayeMessage.ext);
        }
    } else {
        if (handlers[@NO] != nil) {
            MZFayeClientFailureHandler failureHandler = handlers[@NO];
            
            id fayeErrorOrNull = fayeMessage.error;
            if (fayeErrorOrNull == nil) fayeErrorOrNull = NSNull.null;
            NSError *error = [NSError errorWithDomain:MZFayeClientBayeuxErrorDomain code:MZFayeClientBayeuxErrorReceivedFailureStatus userInfo:@{NSLocalizedDescriptionKey : @"Faye server rejected published message", NSLocalizedFailureReasonErrorKey: fayeErrorOrNull}];
            
            failureHandler(error);
        }
    }
    
    [self.sendMessageHandlers removeObjectForKey:fayeMessage.Id];
}

- (void)handleChannelReceivedMessage:(MZFayeMessage *)fayeMessage forChannel:(NSString*)channel
{
    id channelReceivedMessageHandler = self.channelReceivedMessageHandlers[channel];
    if (channelReceivedMessageHandler && channelReceivedMessageHandler != [NSNull null]) {
        
        MZFayeClientSubscriptionHandler handler = channelReceivedMessageHandler;
        handler(fayeMessage.data, fayeMessage.ext);
        
    } else if ([self.delegate respondsToSelector:@selector(fayeClient:didReceiveMessage:fromChannel:extension:)]) {
        [self.delegate fayeClient:self didReceiveMessage:fayeMessage.data fromChannel:fayeMessage.channel extension:fayeMessage.ext];
    }
}

#pragma mark - SRWebSocket Delegate

- (void)webSocket:(SRWebSocket *)webSocket didReceiveMessage:(id)message
{
    id recivedMessage = message;
    
    if ([recivedMessage isKindOfClass:[NSString class]]) {
        recivedMessage = [recivedMessage dataUsingEncoding:NSUTF8StringEncoding];
    }
    
    NSError *error = nil;
    NSArray *messages = [NSJSONSerialization JSONObjectWithData:recivedMessage options:0 error:&error];
    
    if (error && [self.delegate respondsToSelector:@selector(fayeClient:didFailDeserializeMessage:withError:)]) {
        [self.delegate fayeClient:self didFailDeserializeMessage:recivedMessage withError:error];
    } else {
        [self handleFayeMessages:messages];
    }
    
}

- (void)webSocketDidOpen:(SRWebSocket *)webSocket
{
    [self sendBayeuxHandshakeMessage];
}
- (void)webSocket:(SRWebSocket *)webSocket didFailWithError:(NSError *)error
{
    self.connected = NO;
    
    [self clearSubscriptions];
    
    if ([self.delegate respondsToSelector:@selector(fayeClient:didFailWithError:)]) {
        [self.delegate fayeClient:self didFailWithError:error];
    }
    
    [self reconnect];
}
- (void)webSocket:(SRWebSocket *)webSocket didCloseWithCode:(NSInteger)code
           reason:(NSString *)reason wasClean:(BOOL)wasClean
{
    self.connected = NO;
    
    [self clearSubscriptions];
    
    if ([self.delegate respondsToSelector:@selector(fayeClient:didDisconnectWithError:)]) {
        NSError *error = nil;
        if (reason) {
            error = [NSError errorWithDomain:MZFayeClientWebSocketErrorDomain code:code userInfo:@{NSLocalizedDescriptionKey : reason}];
        }
        
        [self.delegate fayeClient:self didDisconnectWithError:error];
    }
    
    [self reconnect];
    
}

@end
