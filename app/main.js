import React, {Component} from 'react-native'
import {Provider} from 'react-redux'
import configureStore from './configureStore'

import Home from './screens/Home'

const store = configureStore()

class Root extends Component {
  render () {
    return (
      <Provider store={store}>
        <Home />
      </Provider>
    )
  }
}

export default Root
