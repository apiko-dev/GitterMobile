import {getItem} from '../utils/storage'
import {getCurrentUser} from './viewer'
import {getRooms, getSuggestedRooms} from './rooms'
import {NetInfo, AppState} from 'react-native'
import {setupFayeEvents, setupFaye, onNetStatusChangeFaye} from './realtime'
import * as Navigation from './navigation'

/**
 * Constants
 */

export const INITIALIZED = 'app/INITIALIZED'
export const CHANGE_NET_STATUS = 'app/CHANGE_NET_STATUS'
export const CHANGE_APP_STATE = 'app/CHANGE_APP_STATE'

/**
 * Action Creators
 */
export function init() {
  return async (dispatch, getState) => {
    dispatch(setupAppStatusListener())
    try {
      // checking internet connection
      const netStatus = await NetInfo.fetch()
      if (netStatus === 'none' || netStatus === 'NONE') {
        dispatch(Navigation.resetTo({name: 'noInternet'}))
        return
      }

      const token = await getItem('token')
      if (!token) {
        dispatch(Navigation.resetTo({name: 'login'}))
        return
      }

      dispatch(setupFayeEvents())
      dispatch({ type: INITIALIZED, token })

      // getting base current user's information
      await dispatch(getCurrentUser())
      await Promise.all([
        dispatch(getRooms()),
        dispatch(getSuggestedRooms()),
        dispatch(setupFaye()),
        dispatch(setupNetStatusListener())
      ])

      // if you need debug room screen, just comment nevigation to 'hone'
      // and uncomment navigation to 'room'
      dispatch(Navigation.resetTo({name: 'home'}))
      // dispatch(Navigation.resetTo({name: 'user', userId: '52ce7f4eed5ab0b3bf053782', username: 'blia'}))
      // dispatch(Navigation.resetTo({name: 'addUser', roomId: '56a41e0fe610378809bde160'}))
      // dispatch(Navigation.resetTo({name: 'roomUsers', roomId: '56a41e0fe610378809bde160'}))
    } catch (error) {
      dispatch({ type: INITIALIZED, error })
      dispatch(Navigation.goAndReplace({name: 'login'}))
    }
  }
}

function setupNetStatusListener() {
  return dispatch => {
    NetInfo.isConnected.addEventListener('change',
      async status => {
        dispatch({type: CHANGE_NET_STATUS, payload: status})
        await dispatch(onNetStatusChangeFaye(status))
      }
    );
  }
}

function setupAppStatusListener() {
  return (dispatch, getState) => {
    AppState.addEventListener('change', status => {
      // TODO: Update drawer rooms state and messages in current room
      // if app status changes from backgrount to active
      dispatch({type: CHANGE_APP_STATE, payload: status})
    })
  }
}


/**
 * Reducer
 */

const initialState = {
  online: false,
  appState: null,
  fayeConnected: false
}

export default function app(state = initialState, action) {
  switch (action.type) {
  case INITIALIZED:
    // return {...state,
    //   online: action.netStatus
    // }
    return state

  case CHANGE_NET_STATUS:
    return {...state,
      online: action.payload
    }

  case CHANGE_APP_STATE:
    return {...state,
      appState: action.payload
    }

  default:
    return state
  }
}
