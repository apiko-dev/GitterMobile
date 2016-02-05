import React, {Component} from 'react-native'
import {Provider} from 'react-redux'
import configureStore from './configureStore'

import App from './screens'

const store = configureStore()

class Root extends Component {
  render () {
    return (
      <Provider store={store}>
        <App />
      </Provider>
    )
  }
}

export default Root
