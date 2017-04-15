//
//  MZFayeMessage.m
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

#import "MZFayeMessage.h"

@implementation MZFayeMessage

- (instancetype)initWithDictionary:(NSDictionary *)dictionary
{
    self = [super init];
    if (self) {
        [self importFromDictionary:dictionary];
    }
    return self;
}

+ (instancetype)messageFromDictionary:(NSDictionary *)dictionary
{
    return [[[self class] alloc] initWithDictionary:dictionary];
}

- (void)importFromDictionary:(NSDictionary *)dictionary
{
    if (dictionary[@"id"] != nil) {
        self.Id = dictionary[@"id"];
    }
    
    if (dictionary[@"timestamp"] != nil) {
        self.timestamp = [NSDate dateWithTimeIntervalSince1970:[dictionary[@"timestamp"] timeInterval]];
    }
    
    NSArray *objectAttributes = @[@"channel", @"clientId", @"successful", @"authSuccessful", @"version", @"minimumVersion", @"supportedConnectionTypes", @"advice", @"error", @"subscription", @"data", @"ext"];
    for (NSString *attribute in objectAttributes) {
        if (dictionary[attribute] != nil) {
            [self setValue:dictionary[attribute] forKey:attribute];
        }
    }
}

@end
