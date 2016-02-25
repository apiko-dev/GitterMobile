import {getItem, removeItem} from '../utils/storage'
import {getCurrentUser} from './viewer'
import {getRooms, getSuggestedRooms, subscribeToRooms, updateRoomState} from './rooms'
import FayeGitter from '../../libs/react-native-gitter-faye'
import {DeviceEventEmitter} from 'react-native'

/**
 * Constants
 */

export const INITIALIZED = 'app/INITIALIZED'
export const CHANGE_NET_STATUS = 'app/CHANGE_NET_STATUS'
export const CHANGE_APP_STATE = 'app/CHANGE_APP_STATE'
export const FAYE_CONNECT = 'app/FAYE_CONNECT'

/**
 * Action Creators
 */

export function init() {
  return async (dispatch, getState) => {
    try {
      const token = await getItem('token')
      dispatch({ type: INITIALIZED, token })

      // getting base current user's information
      await dispatch(getCurrentUser())
      await Promise.all([
        dispatch(getRooms()),
        dispatch(getSuggestedRooms())
      ])

      // setup faye
      await dispatch(setupFaye())
    } catch (error) {
      dispatch({ type: INITIALIZED, error })
    }
  }
}

function setupFaye() {
  return async (dispatch, getState) => {
    FayeGitter.setAccessToken(getState().auth.token)
    FayeGitter.create()
    FayeGitter.logger()
    dispatch(setupFayeEvents())
    try {
      const result = await FayeGitter.connect()
      dispatch({type: FAYE_CONNECT, payload: result})
      dispatch(subscribeToRooms())
    } catch (err) {
      console.log(err)
    }
  }
}


function setupFayeEvents() {
  return dispatch => {
    DeviceEventEmitter.addListener('FayeGitter:onDisconnected',log => console.log(log))
    DeviceEventEmitter.addListener('FayeGitter:onFailedToCreate',log => console.log(log))
    DeviceEventEmitter.addListener('FayeGitter:Message',
      event => dispatch(parseEvent(event))
    )
    DeviceEventEmitter.addListener('FayeGitter:SubscribtionFailed',log => console.log(log))
    DeviceEventEmitter.addListener('FayeGitter:Subscribed',log => console.log(log))
    DeviceEventEmitter.addListener('FayeGitter:Unsubscribed', log => console.log(log))
    DeviceEventEmitter.addListener('FayeGitter:log', log => console.log(log))
  }
}

function parseEvent(event) {
  return (dispatch, getState) => {
    const json = JSON.parse(event.json)
    const {id} = getState().viewer.user
    const roomsChannel = `/api/v1/user/${id}/rooms`

    if (event.channel.match(roomsChannel)) {
      dispatch(updateRoomState(json))
    }
  }
}

/**
 * Reducer
 */

const initialState = {
  online: null,
  appState: null,
  fayeConnected: false
}

export default function app(state = initialState, action) {
  switch (action.type) {
  case CHANGE_NET_STATUS:
    return {...state,
      online: action.payload
    }

  case CHANGE_APP_STATE:
    return {...state,
      appState: action.payload
    }

  case FAYE_CONNECT:
    return {...state,
      fayeConnected: action.payload
    }

  default:
    return state
  }
}
