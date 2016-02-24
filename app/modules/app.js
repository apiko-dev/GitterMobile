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

/**
 * Action Creators
 */

export function init() {
  return async (dispatch, getState) => {
    try {
      const token = await getItem('token')
      dispatch({ type: INITIALIZED, token })

      // setup faye
      FayeGitter.setAccessToken(token)
      FayeGitter.create()

      // getting base current user's information
      await dispatch(getCurrentUser())
      await Promise.all([
        dispatch(getRooms()),
        dispatch(getSuggestedRooms())
      ])

      // connect to the server and subscribe to rooms changes (Drawer)
      await FayeGitter.connect()
      dispatch(subscribeToRooms())
      dispatch(setupFayeEvents())
    } catch (error) {
      dispatch({ type: INITIALIZED, error })
    }
  }
}


function setupFayeEvents() {
  return dispatch => {
    // DeviceEventEmitter.addListener('FayeGitter:onDisconnected',
    // DeviceEventEmitter.addListener('FayeGitter:onFailedToCreate',
    DeviceEventEmitter.addListener('FayeGitter:Message',
      event => dispatch(parseEvent(event))
    )
    // DeviceEventEmitter.addListener('FayeGitter:SubscribtionFailed',
    // DeviceEventEmitter.addListener('FayeGitter:Subscribed',
    // DeviceEventEmitter.addListener('FayeGitter:Unsubscribed',
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
  appState: null
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
  default:
    return state
  }
}
