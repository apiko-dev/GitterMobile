import {combineReducers} from 'redux'
import app from './app'
import auth from './auth'
import rooms from './rooms'
import viewer from './viewer'
import messages from './messages'
import settings from './settings'


const rootReducer = combineReducers({
  app,
  auth,
  rooms,
  viewer,
  messages,
  settings
})

export default rootReducer
