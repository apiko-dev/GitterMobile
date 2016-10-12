import {createStore, applyMiddleware, compose} from 'redux'
import thunkMiddleware from 'redux-thunk'

import rootReducer from './modules'


export default function configureStore(initialState) {
  const devTools = require('remote-redux-devtools')
  /**
   * Create store with remote-devtools and logger middleware. Do it only
   * in development to reduce performance issues.
   */
  if (__DEV__) {
    // const createLogger = require('redux-logger')
    // const logger = createLogger()

    const finalCreateStore = compose(
      applyMiddleware(thunkMiddleware),
      devTools()
    )(createStore)

    const store = finalCreateStore(rootReducer, initialState)

    return store
  } else {
    // const finalCreateStore = compose(applyMiddleware(thunkMiddleware), devTools())(createStore)
    const finalCreateStore = applyMiddleware(thunkMiddleware)(createStore)
    const store = finalCreateStore(rootReducer, initialState)

    return store
  }
}
