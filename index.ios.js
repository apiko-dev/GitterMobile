import React from 'react';
import {AppRegistry} from 'react-native';
import GitterMobile from './app'

global.CURRENT_VERSION = 'v0.5.2'

AppRegistry.registerComponent('gittermobile', () => GitterMobile);
