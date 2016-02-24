import {combineReducers} from 'redux'
import app from './app'
import auth from './auth'
import rooms from './rooms'
import viewer from './viewer'


const rootReducer = combineReducers({
  app,
  auth,
  rooms,
  viewer
})

export default rootReducer
