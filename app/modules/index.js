import {combineReducers} from 'redux'

import ui from './ui'
import app from './app'
import auth from './auth'
import rooms from './rooms'
import users from './users'
import readBy from './readBy'
import viewer from './viewer'
import search from './search'
import roomInfo from './roomInfo'
import messages from './messages'
import settings from './settings'
import realtime from './realtime'
import activity from './activity'
import navigation from './navigation'

const rootReducer = combineReducers({
  ui,
  app,
  auth,
  rooms,
  users,
  readBy,
  viewer,
  search,
  roomInfo,
  messages,
  settings,
  realtime,
  activity,
  navigation
})

export default rootReducer
