//
//  FayeManager.m
//  gittermobile
//
//  Created by Roman Temchenko on 5/4/16.
//  Copyright © 2016 Facebook. All rights reserved.
//

#import "FayeManager.h"
#import <React/RCTEventDispatcher.h>
#import <MZFayeClient/MZFayeClient.h>

@interface FayeManager ()<MZFayeClientDelegate>
@property (nonatomic, copy) NSString *accessToken;
@property (nonatomic, strong) MZFayeClient *fayeClient;
@end

@implementation FayeManager

static NSString * const ExtensionKey = @"ext";

RCT_EXPORT_MODULE()

- (NSArray<NSString *> *)supportedEvents {
  return @[@"FayeGitter:Connected",
           @"FayeGitter:onDisconnected",
           @"FayeGitter:onFailedToCreate",
           @"FayeGitter:Message",
           @"FayeGitter:log",
           @"FayeGitter:SubscribtionFailed",
           @"FayeGitter:Subscribed",
           @"FayeGitter:Unsubscribed",
           ];
}

RCT_EXPORT_METHOD(setAccessToken:(NSString *)accessToken)
{
  _accessToken = [accessToken copy];
}

RCT_EXPORT_METHOD(create)
{
  NSURL *url = [NSURL URLWithString:@"https://ws.gitter.im/faye"];
  self.fayeClient = [[MZFayeClient alloc] initWithURL:url];
  self.fayeClient.delegate = self;
  if (self.accessToken) {
    [self.fayeClient setExtension:@{@"token": self.accessToken} forChannel:MZFayeClientBayeuxChannelHandshake];
  }
}

RCT_REMAP_METHOD(connect,
                 connect:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
  __weak typeof(self) weakSelf = self;
  [self.fayeClient connect:^(NSDictionary *extension) {
    [weakSelf sendEventWithName:@"FayeGitter:Connected" body:@"Connected"];
    resolve(@(YES));
  } failure:^(NSError *error) {
    reject(@"FailedToConnect", @"Failed to connect", error);
  }];
}

RCT_EXPORT_METHOD(disconnect)
{
  __weak typeof(self) weakSelf = self;
  [self.fayeClient disconnect:^(NSDictionary *extension) {
    [weakSelf sendEventWithName:@"FayeGitter:onDisconnected" body:@"Disconnected"];
  } failure:^(NSError *error) {
    
  }];
}

RCT_EXPORT_METHOD(subscribe:(NSString *)channelName)
{
  __weak typeof(self) weakSelf = self;
  [self.fayeClient subscribeToChannel:channelName success:^(NSDictionary *extension) {
    [weakSelf sendEventWithName:@"FayeGitter:Subscribed" body:@{@"channel": channelName,
                                                                ExtensionKey: [weakSelf extensionStringOrNull:extension]}];
  } failure:^(NSError *error) {
    [weakSelf sendEventWithName:@"FayeGitter:SubscribtionFailed" body:@{@"channel": channelName, @"Exception": error.localizedDescription}];
  } receivedMessage:^(NSDictionary *message, NSDictionary *extension) {
    NSString *jsonString = [self stringFromDictionary:message];
    [weakSelf sendEventWithName:@"FayeGitter:Message" body:@{@"channel": channelName,
                                                             @"json": jsonString,
                                                             ExtensionKey: [weakSelf extensionStringOrNull:extension]}];
  }];
}

RCT_EXPORT_METHOD(unsubscribe:(NSString *)channelName)
{
  __weak typeof(self) weakSelf = self;
  [self.fayeClient unsubscribeFromChannel:channelName success:^(NSDictionary *extension) {
    [weakSelf sendEventWithName:@"FayeGitter:Unsubscribed" body:@{@"channel": channelName,
                                                                  ExtensionKey: [weakSelf extensionStringOrNull:extension]}];
  } failure:nil];
}

RCT_REMAP_METHOD(checkConnectionStatus,
                 checkConnectionStatus:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
  resolve(@(self.fayeClient.isConnected));
}

RCT_EXPORT_METHOD(logger)
{
  NSLog(@"You shall not log!");
}

#pragma mark - MZFayeClientDelegate

- (void)fayeClient:(MZFayeClient *)client didDisconnectWithError:(NSError *)error
{
  [self sendEventWithName:@"FayeGitter:onDisconnected" body:@"Disconnected"];
}

- (void)fayeClient:(MZFayeClient *)client didUnsubscribeFromChannel:(NSString *)channel extension:(NSDictionary *)extension
{
  [self sendEventWithName:@"FayeGitter:Unsubscribed" body:@{@"channel": channel,
                                                            ExtensionKey: [self extensionStringOrNull:extension]}];
}

#pragma mark - Private

- (id)extensionStringOrNull:(NSDictionary *)extension {
  if (extension) {
    return [self stringFromDictionary:extension];
  }
  else {
    return [NSNull null];
  }
}

- (NSString *)stringFromDictionary:(NSDictionary *)dictionary
{
  NSData *data = [NSJSONSerialization dataWithJSONObject:dictionary options:kNilOptions error:nil];
  return [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];
}

@end
