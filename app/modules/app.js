import {getItem, removeItem} from '../utils/storage'
import {getCurrentUser} from './viewer'
import {getRooms, getSuggestedRooms, subscribeToRooms, updateRoomState} from './rooms'
import {appendMessages} from './messages'
import FayeGitter from '../../libs/react-native-gitter-faye'
import {DeviceEventEmitter, NetInfo, AppState} from 'react-native'

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
    dispatch(setupAppStatusListener())
    dispatch(setupFayeEvents())
    try {
      const token = await getItem('token')
      const netStatus = await NetInfo.fetch()
      dispatch({ type: INITIALIZED, token, netStatus })

      // TODO: do things belowe only if the internet is awailible (netStatus)

      // getting base current user's information
      await dispatch(getCurrentUser())
      await Promise.all([
        dispatch(getRooms()),
        dispatch(getSuggestedRooms())
      ])

      // setup faye
      await dispatch(setupFaye())
      await dispatch(setupNetStatusListener())
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
    try {
      const result = await FayeGitter.connect()
      dispatch({type: FAYE_CONNECT, payload: result})
      dispatch(subscribeToRooms())
    } catch (err) {
      console.log(err) // eslint-disable-line no-console
    }
  }
}

function onNetStatusChangeFaye(status) {
  return async (dispatch, getState) => {
    const {fayeConnected} = getState().app
    if (!status && fayeConnected) {
      dispatch({type: FAYE_CONNECT, payload: status})
    }
    if (status && !fayeConnected) {
      dispatch(setupFaye())
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
  return dispatch => {
    AppState.addEventListener('change',
      status => dispatch({type: CHANGE_APP_STATE, payload: status})
    );
  }
}


function setupFayeEvents() {
  return (dispatch, getState) => {
    DeviceEventEmitter
      .addListener('FayeGitter:onDisconnected', log => {
        console.warn(log) // eslint-disable-line no-console
        dispatch(setupFaye())
      })

    DeviceEventEmitter
      .addListener('FayeGitter:onFailedToCreate', log => {
        console.warn(log) // eslint-disable-line no-console
        if (getState().app.netStatus) {
          dispatch(setupFaye())
        }
      })
    DeviceEventEmitter
      .addListener('FayeGitter:Message', event => {
        dispatch(parseEvent(event))
      })
    DeviceEventEmitter
      .addListener('FayeGitter:SubscribtionFailed', log => console.warn(log)) // eslint-disable-line no-console
    DeviceEventEmitter
      .addListener('FayeGitter:Subscribed', log => console.log(log)) // eslint-disable-line no-console
    DeviceEventEmitter
      .addListener('FayeGitter:Unsubscribed', log => console.log(log)) // eslint-disable-line no-console
    DeviceEventEmitter
      .addListener('FayeGitter:log', log => console.log(log)) // eslint-disable-line no-console
  }
}

function parseEvent(event) {
  return (dispatch, getState) => {
    const message = JSON.parse(event.json)
    const {id} = getState().viewer.user
    const {activeRoom} = getState().rooms
    const roomsChannel = `/api/v1/user/${id}/rooms`
    const chatMessages = `/api/v1/rooms/${activeRoom}/chatMessages`

    if (event.channel.match(roomsChannel)) {
      dispatch(updateRoomState(message))
    }

    if (event.channel.match(chatMessages)) {
      dispatch(appendMessages(activeRoom, [message.model]))
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
  case INITIALIZED:
    return {...state,
      online: action.netStatus
    }

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
