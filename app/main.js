import React, {Component} from 'react-native'
import {Provider} from 'react-redux'
import configureStore from './configureStore'

import App from './screens'
import {init} from './modules/init'

const store = configureStore()

// initialize application
store.dispatch(init())

class Root extends Component {
  render() {
    return (
      <Provider store={store}>
        <App dispatch={store.dispatch}/>
      </Provider>
    )
  }
}

export default Root
