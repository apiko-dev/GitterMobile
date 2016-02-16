import {combineReducers} from 'redux'
import auth from './auth'
import rooms from './rooms'
import viewer from './viewer'


const rootReducer = combineReducers({
  auth,
  rooms,
  viewer
})

export default rootReducer
