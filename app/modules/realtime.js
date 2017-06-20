import FayeGitter from '../../libs/react-native-gitter-faye/index'
import {DeviceEventEmitter, NativeEventEmitter, Platform} from 'react-native'
import {updateRoomState, receiveRoomsSnapshot} from './rooms'
import {appendMessages, updateMessageRealtime, receiveRoomMessagesSnapshot} from './messages'
import {receiveRoomEventsSnapshot} from './activity'
import {receiveReadBySnapshot} from './readBy'
import HalleyClient from '../api/faye'

let client = null

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
<<<<<<< HEAD
  return (dispatch, getState) => {
    console.log('CONNECT TO FAYE')
    client = new HalleyClient({
      token: getState().auth.token,
      snapshotHandler: (message) => dispatch(dispatchSnapshotEvent(message))
    })
    client.setup()
    client.create()
=======
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
>>>>>>> acf95f0673ac3b8a23f7b181d3d4f6c57032a564
  }
}

/**
 * Handler which handles net status changes and reconnects to faye if needed
 */

export function onNetStatusChangeFaye(status) {
  return (dispatch, getState) => {

  }
}


/**
 * Function which parse incoming events and dispatchs needed action
 */

function dispatchMessageEvent(message) {
  return (dispatch, getState) => {
<<<<<<< HEAD
    console.log('MESSAGE', message)
=======
    // console.log('MESSAGE', event)
    const message = JSON.parse(event.json)
>>>>>>> acf95f0673ac3b8a23f7b181d3d4f6c57032a564

    const {id} = getState().viewer.user
    const {activeRoom} = getState().rooms

    if (!!message.model.fromUser && message.model.fromUser.id !== id && message.operation === 'create') {
      dispatch(appendMessages(activeRoom, [message.model]))
    }

    if (message.operation === 'update' || message.operation === 'patch') {
      dispatch(updateMessageRealtime(activeRoom, message.model))
    }
  }
}

function dispatchRoomEvent(message) {
  return (dispatch, getState) => {
    console.log('MESSAGE', message)
    dispatch(updateRoomState(message))
  }
}

export function dispatchSnapshotEvent({subscription, ext: {snapshot}}) {
  return dispatch => {
    if (subscription.match(roomsRegx)) {
      dispatch(receiveRoomsSnapshot(snapshot))
    }

    if (subscription.match(messagesRegx)) {
      const id = subscription.match(messagesRegxIds)[1]
      dispatch(receiveRoomMessagesSnapshot(id, snapshot))
    }

    if (subscription.match(eventsRegx)) {
      const id = subscription.match(eventsRegxIds)[1]
      dispatch(receiveRoomEventsSnapshot(id, snapshot))
    }

    if (subscription.match(readByRegx)) {
      const messageId = subscription.match(readByRegxIds)[2]
      dispatch(receiveReadBySnapshot(messageId, snapshot))
    }
  }
}

/**
 * Subscribe current user rooms changes (Drawer)
 */

export function subscribeToRooms() {
  return async (dispatch, getState) => {
    try {
      const {id} = getState().viewer.user
      const url = `/api/v1/user/${id}/rooms`
      const type = 'userRooms'
      // const result = await client.subscribe({
      //   url,
      //   type,
      //   handler: evt => dispatch(dispatchRoomEvent(evt))
      // })
      dispatch({type: ROOMS_SUBSCRIBED})

      // await client.subscribe({
      //   url: `/api/v1/user/${id}`,
      //   type,
      //   handler: evt => console.log('USER: ', evt)
      // })
    } catch (err) {
      console.log(err)
    }
  }
}

/**
 * Subscribe for new room's messages => faye chat messages endpoint
 */

export function subscribeToChatMessages(roomId) {
  return async (dispatch, getState) => {
    try {
      const url = `/api/v1/rooms/${roomId}/chatMessages`
      const type = 'chatMessages'
      const result = await client.subscribe({
        url,
        type,
        handler: evt => dispatch(dispatchMessageEvent(evt))
      })
      dispatch({type: SUBSCRIBE_TO_CHAT_MESSAGES, roomId})
      // const {id} = getState().viewer.user
      // await client.subscribe({
      //   url: `/api/v1/user/${id}/rooms/${roomId}/unreadItems`,
      //   type: 'ureadItems',
      //   handler: evt => console.log('UnreadItems: ', evt)
      // })
    } catch (err) {
      console.log(err)
    }
  }
}

/**
 * Unsubscribe for new room's messages => faye chat messages endpoint
 */

export function unsubscribeToChatMessages(roomId) {
  return async dispatch => {
    try {
      const url = `/api/v1/rooms/${roomId}/chatMessages`
      const type = 'chatMessages'
      const result = await client.unsubscribe({
        url,
        type
      })
      dispatch({type: UNSUBSCRIBE_TO_CHAT_MESSAGES, roomId})
    } catch (err) {
      console.log(err)
    }
  }
}


export function subscribeToRoomEvents(roomId) {
  return async dispatch => {
    try {
      const url = `/api/v1/rooms/${roomId}/events`
      const type = 'roomEvents'
      const result = await client.subscribe({
        url,
        type
      })
      dispatch({type: SUBSCRIBE_TO_ROOM_EVENTS, roomId})
    } catch (err) {
      console.log(err)
    }
  }
}

/**
 * Unsubscribe for new room's messages => faye chat messages endpoint
 */

export function unsubscribeToRoomEvents(roomId) {
  return async (dispatch) => {
    try {
      const url = `/api/v1/rooms/${roomId}/events`
      const type = 'roomEvents'
      const result = await client.unsubscribe({
        url,
        type
      })
      dispatch({type: UNSUBSCRIBE_TO_ROOM_EVENTS, roomId})
    } catch (err) {
      console.log(err)
    }
  }
}

export function subscribeToReadBy(roomId, messageId) {
  return async dispatch => {
    try {
      const url = `/api/v1/rooms/${roomId}/chatMessages/${messageId}/readBy`
      const type = 'roomEvents'
      const result = await client.subscribe({
        url,
        type
      })
      dispatch({type: SUBSCRIBE_TO_READ_BY, roomId})
    } catch (err) {
      console.log(err)
    }
  }
}

/**
 * Unsubscribe for new room's messages => faye chat messages endpoint
 */

export function unsubscribeFromReadBy(roomId, messageId) {
  return async (dispatch) => {
<<<<<<< HEAD
    try {
      const url = `/api/v1/rooms/${roomId}/chatMessages/${messageId}/readBy`
      const type = 'roomEvents'
      const result = await client.unsubscribe({
        url,
        type
      })
      dispatch({type: UNSUBSCRIBE_FROM_READ_BY, roomId})
    } catch (err) {
      console.log(err)
=======
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
>>>>>>> acf95f0673ac3b8a23f7b181d3d4f6c57032a564
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

  default:
    return state
  }
}
