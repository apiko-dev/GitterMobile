import React, {Component} from 'react';
import {StatusBar, View} from 'react-native';
import {Provider} from 'react-redux'
import configureStore from './configureStore'
import {THEMES} from './constants'
const {colors} = THEMES.gitterDefault

import App from './screens'

const store = configureStore()

class Root extends Component {
  render() {
    return (
      <Provider store={store}>
        <View style={{flex: 1}}>
        <StatusBar
          backgroundColor={colors.darkRed}
          barStyle="dark-content" />
          <App />
        </View>
      </Provider>
    )
  }
}

export default Root
