//
//  FayeManager.m
//  gittermobile
//
//  Created by Roman Temchenko on 5/4/16.
//  Copyright © 2016 Facebook. All rights reserved.
//

#import "FayeManager.h"
#import "RCTEventDispatcher.h"
#import <MZFayeClient/MZFayeClient.h>

@interface FayeManager ()<MZFayeClientDelegate>
@property (nonatomic, copy) NSString *accessToken;
@property (nonatomic, strong) MZFayeClient *fayeClient;
@end

@implementation FayeManager

@synthesize bridge;

RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(setAccessToken:(NSString *)accessToken)
{
  _accessToken = [accessToken copy];
}

RCT_EXPORT_METHOD(create)
{
  self.fayeClient = [[MZFayeClient alloc] initWithURL:nil];
  self.fayeClient.delegate = self;
}

RCT_REMAP_METHOD(connect,
                 resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
  [self.fayeClient connect:^{
    resolve(@(YES));
  } failure:^(NSError *error) {
    reject(@"FailedToConnect", @"Failed to connect", error);
  }];
}

RCT_EXPORT_METHOD(disconnect)
{
  [self.fayeClient disconnect:^{
    
  } failure:^(NSError *error) {
    
  }];
}

RCT_EXPORT_METHOD(subscribe:(NSString *)channelName)
{
  __weak typeof(self) weakSelf = self;
  [self.fayeClient subscribeToChannel:channelName success:^{
    [weakSelf.bridge.eventDispatcher sendAppEventWithName:@"FayeGitter:Subscribed" body:@{@"channel": channelName}];
  } failure:^(NSError *error) {
    [weakSelf.bridge.eventDispatcher sendAppEventWithName:@"FayeGitter:SubscribtionFailed" body:@{@"channel": channelName,
                                                                                                  @"Exception": error}];
  } receivedMessage:^(NSDictionary *message) {
    [weakSelf.bridge.eventDispatcher sendAppEventWithName:@"FayeGitter:Message" body:@{@"channel": channelName,
                                                                                       @"json": message}];
  }];
}

#pragma mark - MZFayeClientDelegate

- (void)fayeClient:(MZFayeClient *)client didDisconnectWithError:(NSError *)error
{
  [self.bridge.eventDispatcher sendAppEventWithName:@"FayeGitter:onDisconnected" body:@"Disconnected"];
}

- (void)fayeClient:(MZFayeClient *)client didUnsubscribeFromChannel:(NSString *)channel
{
  [self.bridge.eventDispatcher sendAppEventWithName:@"FayeGitter:Unsubscribed" body:@{@"channel": channel}];
}

@end
