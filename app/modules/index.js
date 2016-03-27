import {combineReducers} from 'redux'

import ui from './ui'
import app from './app'
import auth from './auth'
import rooms from './rooms'
import users from './users'
import viewer from './viewer'
import search from './search'
import roomInfo from './roomInfo'
import messages from './messages'
import settings from './settings'
import realtime from './realtime'
import navigation from './navigation'

const rootReducer = combineReducers({
  ui,
  app,
  auth,
  rooms,
  users,
  viewer,
  search,
  roomInfo,
  messages,
  settings,
  realtime,
  navigation
})

export default rootReducer
