import {combineReducers} from 'redux'
import app from './app'
import auth from './auth'
import rooms from './rooms'
import viewer from './viewer'
import messages from './messages'


const rootReducer = combineReducers({
  app,
  auth,
  rooms,
  viewer,
  messages
})

export default rootReducer
