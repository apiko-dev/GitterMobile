import FayeGitter from '../../libs/react-native-gitter-faye/index'
import {DeviceEventEmitter, NativeEventEmitter, Platform} from 'react-native'
import {updateRoomState, receiveRoomsSnapshot} from './rooms'
import {appendMessages, updateMessageRealtime, receiveRoomMessagesSnapshot} from './messages'
import {receiveRoomEventsSnapshot} from './activity'
import {receiveReadBySnapshot} from './readBy'

/**
 * Constants
 */

export const FAYE_CONNECTING = 'realtime/FAYE_CONNECTING'
export const FAYE_CONNECT = 'realtime/FAYE_CONNECT'
export const ROOMS_SUBSCRIBED = 'realtime/ROOMS_SUBSCRIBED'
export const ROOMS_UNSUBSCRIBED = 'realtime/ROOMS_UNSUBSCRIBED'
export const SUBSCRIBE_TO_CHAT_MESSAGES = 'realtime/SUBSCRIBE_TO_CHAT_MESSAGES'
export const UNSUBSCRIBE_TO_CHAT_MESSAGES = 'realtime/UNSUBSCRIBE_TO_CHAT_MESSAGES'
export const SUBSCRIBE_TO_ROOM_EVENTS = 'realtime/SUBSCRIBE_TO_ROOM_EVENTS'
export const UNSUBSCRIBE_TO_ROOM_EVENTS = 'realtime/UNSUBSCRIBE_TO_ROOM_EVENTS'
export const SUBSCRIBE_TO_READ_BY = 'realtime/SUBSCRIBE_TO_READ_BY'
export const UNSUBSCRIBE_FROM_READ_BY = 'realtime/UNSUBSCRIBE_FROM_READ_BY'
export const PUSH_SUBSCRIPTION = 'realtime/PUSH_SUBSCRIPTION'
export const DELETE_SUBSCRIPTION = 'realtime/DELETE_SUBSCRIPTION'
export const SUBSCRIBED_TO_CHANNELS = 'realtime/SUBSCRIBED_TO_CHANNELS'

const roomsRegx = /\/api\/v1\/user\/[a-f\d]{24}\/rooms/
const messagesRegx = /\/api\/v1\/rooms\/[a-f\d]{24}\/chatMessages/
const messagesRegxIds = /\/api\/v1\/rooms\/([a-f\d]{24})\/chatMessages/
const eventsRegx = /\/api\/v1\/rooms\/[a-f\d]{24}\/events/
const eventsRegxIds = /\/api\/v1\/rooms\/([a-f\d]{24})\/events/
const readByRegx = /\/api\/v1\/rooms\/[a-f\d]{24}\/chatMessages\/[a-f\d]{24}\/readBy/
const readByRegxIds = /\/api\/v1\/rooms\/([a-f\d]{24})\/chatMessages\/([a-f\d]{24})\/readBy/


/**
 * Actions
 */

export function setupFaye() {
  return async (dispatch, getState) => {
    console.log('RECONNECT TO FAYE')
    FayeGitter.setAccessToken(getState().auth.token)
    FayeGitter.create()
    FayeGitter.logger()
    try {
      dispatch({type: FAYE_CONNECTING})
      const result = await FayeGitter.connect()
      dispatch({type: FAYE_CONNECT, payload: result})
      // dispatch(subscribeToChannels())
    } catch (err) {
      console.log(err) // eslint-disable-line no-console
    }
  }
}

export function checkFayeConnection() {
  return async (dispatch, getState) => {
    try {
      const connectionStatus = await FayeGitter.checkConnectionStatus()
      // console.log('CONNECTION_STATUS', connectionStatus)
      if (!connectionStatus) {
        await dispatch(setupFaye())
      }
    } catch (error) {
      console.error(error.message)
    }
  }
}

/**
 * Handler which handles net status changes and reconnects to faye if needed
 */

export function onNetStatusChangeFaye(status) {
  return async (dispatch, getState) => {
    const {isFayeConnecting} = getState().app
    if (isFayeConnecting) {
      return
    }
    const connectionStatus = await FayeGitter.checkConnectionStatus()
    if (!status && connectionStatus) {
      dispatch({type: FAYE_CONNECT, payload: status})
    }
    try {
      if (status && !connectionStatus) {
        await dispatch(setupFaye())
      }
    } catch (error) {
      console.warn(error.message)
    }
  }
}

/**
 * Setup faye events
 */

export function setupFayeEvents() {
  return (dispatch, getState) => {
    const EventEmitter = Platform.OS === 'ios' ? new NativeEventEmitter(FayeGitter) : DeviceEventEmitter
    EventEmitter
      .addListener('FayeGitter:Connected', log => {
        console.log('CONNECTED')
        dispatch(subscribeToChannels())
      })
    EventEmitter
      .addListener('FayeGitter:onDisconnected', log => {
        console.log(log) // eslint-disable-line no-console
        dispatch(setupFaye())
      })

    EventEmitter
      .addListener('FayeGitter:onFailedToCreate', log => {
        console.log(log) // eslint-disable-line no-console
        const {online} = getState().app
        if (online === true) {
          dispatch(setupFaye())
        }
      })
    EventEmitter
      .addListener('FayeGitter:Message', event => {
        dispatch(parseEvent(event))
      })
    EventEmitter
      .addListener('FayeGitter:log', event => {
        dispatch(parseSnapshotEvent(event))
      })
    EventEmitter
      .addListener('FayeGitter:SubscribtionFailed', log => console.log(log)) // eslint-disable-line no-console
    EventEmitter
      .addListener('FayeGitter:Subscribed', event => {
        console.log('SUBSCRIBED', event) // eslint-disable-line no-console
        if (Platform.OS === 'ios') {
          try {
            const {channel, ext} = event
            const snapshot = JSON.parse(ext).snapshot
            if (typeof channel !== 'undefined' && typeof snapshot !== 'undefined') {
              dispatch(parseSnapshotForChannel(channel, snapshot))
            }
          } catch (error) {
            console.warn(error.message)
          }
        }
      })
    EventEmitter
      .addListener('FayeGitter:Unsubscribed', log => console.log('UNSUBSCRIBED', log)) // eslint-disable-line no-console
  }
}

export function removeFayeEvents() {
  return (dispatch) => {
    DeviceEventEmitter.removeEventListener('FayeGitter:Connected')
    DeviceEventEmitter.removeEventListener('FayeGitter:onDisconnected')
    DeviceEventEmitter.removeEventListener('FayeGitter:onFailedToCreate')
    DeviceEventEmitter.removeEventListener('FayeGitter:Message')
    DeviceEventEmitter.removeEventListener('FayeGitter:log')
    DeviceEventEmitter.removeEventListener('FayeGitter:SubscribtionFailed')
    DeviceEventEmitter.removeEventListener('FayeGitter:Subscribed')
    DeviceEventEmitter.removeEventListener('FayeGitter:Unsubscribed')
  }
}

/**
 * Function which parse incoming events and dispatchs needed action
 */

function parseEvent(event) {
  return (dispatch, getState) => {
    // console.log('MESSAGE', event)
    const message = JSON.parse(event.json)

    const {id} = getState().viewer.user
    const {activeRoom} = getState().rooms
    const roomsChannel = `/api/v1/user/${id}/rooms`
    const chatMessages = `/api/v1/rooms/${activeRoom}/chatMessages`

    if (event.channel.match(roomsChannel)) {
      dispatch(updateRoomState(message))
    }

    if (event.channel.match(chatMessages)) {
      if (!!message.model.fromUser && message.model.fromUser.id !== id && message.operation === 'create') {
        dispatch(appendMessages(activeRoom, [message.model]))
      }

      if (message.operation === 'update' || message.operation === 'patch') {
        dispatch(updateMessageRealtime(activeRoom, message.model))
      }
    }
  }
}

export function parseSnapshotEvent(event) {
  return dispatch => {
    if (!event.log.match('Received message: ')) {
      return
    }

    const message = JSON.parse(event.log.split('Received message: ')[1])

    if (message.channel !== '/meta/subscribe' || message.successful !== true) {
      return
    }

    if (message.hasOwnProperty('ext') && message.ext.hasOwnProperty('snapshot')) {
      dispatch(parseSnapshotForChannel(message.subscription, message.ext.snapshot))
    }
  }
}

export function parseSnapshotForChannel(channel, snapshot) {
  return dispatch => {
    if (channel.match(roomsRegx)) {
      dispatch(receiveRoomsSnapshot(snapshot))
    }

    if (channel.match(messagesRegx)) {
      const id = channel.match(messagesRegxIds)[1]
      dispatch(receiveRoomMessagesSnapshot(id, snapshot))
    }

    if (channel.match(eventsRegx)) {
      const id = channel.match(eventsRegxIds)[1]
      dispatch(receiveRoomEventsSnapshot(id, snapshot))
    }

    if (channel.match(readByRegx)) {
      const messageId = channel.match(readByRegxIds)[2]
      dispatch(receiveReadBySnapshot(messageId, snapshot))
    }
  }
}

/**
 * Subscribe current user rooms changes (Drawer)
 */

export function subscribeToRooms() {
  return async (dispatch, getState) => {
    await checkFayeConnection()
    const {id} = getState().viewer.user
    const subscription = `/api/v1/user/${id}/rooms`
    FayeGitter.subscribe(subscription)
    dispatch({type: ROOMS_SUBSCRIBED})
    dispatch(pushSubscription(subscription))
  }
}

/**
 * Subscribe for new room's messages => faye chat messages endpoint
 */

export function subscribeToChatMessages(roomId) {
  return async dispatch => {
    await checkFayeConnection()
    const subscription = `/api/v1/rooms/${roomId}/chatMessages`
    FayeGitter.subscribe(subscription)
    dispatch({type: SUBSCRIBE_TO_CHAT_MESSAGES, roomId})
    dispatch(pushSubscription(subscription))
  }
}

/**
 * Unsubscribe for new room's messages => faye chat messages endpoint
 */

export function unsubscribeToChatMessages(roomId) {
  return async (dispatch) => {
    await checkFayeConnection()
    const subscription = `/api/v1/rooms/${roomId}/chatMessages`
    FayeGitter.unsubscribe(subscription)
    dispatch({type: UNSUBSCRIBE_TO_CHAT_MESSAGES, roomId})
    dispatch(deleteSubscription(subscription))
  }
}


export function subscribeToRoomEvents(roomId) {
  return async dispatch => {
    await checkFayeConnection()
    const subscription = `/api/v1/rooms/${roomId}/events`
    FayeGitter.subscribe(subscription)
    dispatch({type: SUBSCRIBE_TO_ROOM_EVENTS, roomId})
    dispatch(pushSubscription(subscription))
  }
}

/**
 * Unsubscribe for new room's messages => faye chat messages endpoint
 */

export function unsubscribeToRoomEvents(roomId) {
  return async (dispatch) => {
    await checkFayeConnection()
    const subscription = `/api/v1/rooms/${roomId}/events`
    FayeGitter.unsubscribe(subscription)
    dispatch({type: UNSUBSCRIBE_TO_ROOM_EVENTS, roomId})
    dispatch(deleteSubscription(subscription))
  }
}

export function subscribeToReadBy(roomId, messageId) {
  return async dispatch => {
    await checkFayeConnection()
    const subscription = `/api/v1/rooms/${roomId}/chatMessages/${messageId}/readBy`
    FayeGitter.subscribe(subscription)
    dispatch({type: SUBSCRIBE_TO_READ_BY, roomId})
    dispatch(pushSubscription(subscription))
  }
}

/**
 * Unsubscribe for new room's messages => faye chat messages endpoint
 */

export function unsubscribeFromReadBy(roomId, messageId) {
  return async (dispatch) => {
    await checkFayeConnection()
    const subscription = `/api/v1/rooms/${roomId}/chatMessages/${messageId}/readBy`
    FayeGitter.unsubscribe(subscription)
    dispatch({type: UNSUBSCRIBE_FROM_READ_BY, roomId})
    dispatch(deleteSubscription(subscription))
  }
}

export function pushSubscription(subscription) {
  return (dispatch, getState) => {
    const {subscriptions} = getState().realtime
    if (!subscriptions.find(item => item === subscription)) {
      dispatch({type: PUSH_SUBSCRIPTION, subscription})
      // console.log('PUSH_SUBSCRIPTION', subscription)
    }
  }
}

export function deleteSubscription(subscription) {
  return (dispatch, getState) => {
    const {subscriptions} = getState().realtime
    if (!!subscriptions.find(item => item === subscription)) {
      dispatch({type: DELETE_SUBSCRIPTION, subscription})
      // console.log('DELETE_SUBSCRIPTION', subscription)
    }
  }
}

export function subscribeToChannels() {
  return (dispatch, getState) => {
    const {subscriptions} = getState().realtime
    if (subscriptions.length === 0) {
      dispatch(subscribeToRooms())
    } else {
      subscriptions.forEach(subscription => FayeGitter.subscribe(subscription))
      dispatch({type: SUBSCRIBED_TO_CHANNELS, subscriptions})
    }
  }
}

/**
 * Reducer
 */

const initialState = {
  isFayeConnecting: false,
  fayeConnected: false,
  roomsSubscribed: false,
  roomMessagesSubscription: '',
  subscriptions: []
}

export default function realtime(state = initialState, action) {
  switch (action.type) {
  case FAYE_CONNECTING:
    return {...state,
      isFayeConnecting: true
    }
  case FAYE_CONNECT:
    return {...state,
      fayeConnected: action.payload,
      isFayeConnecting: false
    }

  case ROOMS_SUBSCRIBED: {
    return {...state,
      roomsSubscribed: true
    }
  }

  case SUBSCRIBE_TO_CHAT_MESSAGES:
    return {...state,
      roomMessagesSubscription: action.payload
    }

  case PUSH_SUBSCRIPTION:
    return {...state,
      subscriptions: state.subscriptions.concat(action.subscription)
    }

  case DELETE_SUBSCRIPTION:
    return {...state,
      subscriptions: state.subscriptions.filter(subscription => action.subscription !== subscription)
    }

  default:
    return state
  }
}
