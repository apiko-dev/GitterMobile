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
    dispatch(setupFayeEvents())
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

      dispatch({ type: INITIALIZED, token })

      // TODO: do things belowe only if the internet is awailible (netStatus)

      // getting base current user's information
      await dispatch(getCurrentUser())
      await Promise.all([
        dispatch(getRooms()),
        dispatch(getSuggestedRooms()),
        dispatch(setupFaye()),
        dispatch(setupNetStatusListener())
      ])

      dispatch(Navigation.resetTo({name: 'home'}))
      // setup faye
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
