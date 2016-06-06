import FayeGitter from '../../libs/react-native-gitter-faye'
import {DeviceEventEmitter} from 'react-native'
import {updateRoomState, receiveRoomsSnapshot} from './rooms'
import {appendMessages, updateMessageRealtime, receiveRoomMessagesSnapshot} from './messages'
import {receiveRoomEventsSnapshot} from './activity'
import {receiveReadBySnapshot} from './readBy'

/**
 * Constants
 */

export const FAYE_CONNECT = 'realtime/FAYE_CONNECT'
export const ROOMS_SUBSCRIBED = 'realtime/ROOMS_SUBSCRIBED'
export const ROOMS_UNSUBSCRIBED = 'realtime/ROOMS_UNSUBSCRIBED'
export const SUBSCRIBE_TO_CHAT_MESSAGES = 'realtime/SUBSCRIBE_TO_CHAT_MESSAGES'
export const UNSUBSCRIBE_TO_CHAT_MESSAGES = 'realtime/UNSUBSCRIBE_TO_CHAT_MESSAGES'
export const SUBSCRIBE_TO_ROOM_EVENTS = 'realtime/SUBSCRIBE_TO_ROOM_EVENTS'
export const UNSUBSCRIBE_TO_ROOM_EVENTS = 'realtime/UNSUBSCRIBE_TO_ROOM_EVENTS'
export const SUBSCRIBE_TO_READ_BY = 'realtime/SUBSCRIBE_TO_READ_BY'
export const UNSUBSCRIBE_FROM_READ_BY = 'realtime/UNSUBSCRIBE_FROM_READ_BY'


/**
 * Actions
 */

export function setupFaye() {
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

/**
 * Handler which handles net status changes and reconnects to faye if needed
 */

export function onNetStatusChangeFaye(status) {
  return async (dispatch, getState) => {
    const {fayeConnected} = getState().app
    if (!status && fayeConnected) {
      dispatch({type: FAYE_CONNECT, payload: status})
    }
    try {
      if (status && !fayeConnected) {
        await dispatch(setupFaye())
      }
    } catch (error) {
      console.log(error)
    }
  }
}

/**
 * Setup faye events
 */

export function setupFayeEvents() {
  return (dispatch, getState) => {
    DeviceEventEmitter
      .addListener('FayeGitter:onDisconnected', log => {
        console.warn(log) // eslint-disable-line no-console
        dispatch(setupFaye())
      })

    DeviceEventEmitter
      .addListener('FayeGitter:onFailedToCreate', log => {
        console.warn(log) // eslint-disable-line no-console
        const {netStatus} = getState().app
        if (netStatus === true) {
          dispatch(setupFaye())
        }
      })
    DeviceEventEmitter
      .addListener('FayeGitter:Message', event => {
        dispatch(parseEvent(event))
      })
    DeviceEventEmitter
      .addListener('FayeGitter:log', event => {
        dispatch(parseSnapshotEvent(event))
      })
    DeviceEventEmitter
      .addListener('FayeGitter:SubscribtionFailed', log => console.warn(log)) // eslint-disable-line no-console
    DeviceEventEmitter
      .addListener('FayeGitter:Subscribed', log => console.log('SUBSCRIBED', log)) // eslint-disable-line no-console
    DeviceEventEmitter
      .addListener('FayeGitter:Unsubscribed', log => console.log(log)) // eslint-disable-line no-console
  }
}

export function removeFayeEvents() {
  return (dispatch) => {
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
    console.log('MESSAGE', event)
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

    const sbs = message.subscription

    const roomsRegx = /\/api\/v1\/user\/[a-f\d]{24}\/rooms/
    const messagesRegx = /\/api\/v1\/rooms\/[a-f\d]{24}\/chatMessages/
    const messagesRegxIds = /\/api\/v1\/rooms\/([a-f\d]{24})\/chatMessages/
    const eventsRegx = /\/api\/v1\/rooms\/[a-f\d]{24}\/events/
    const eventsRegxIds = /\/api\/v1\/rooms\/([a-f\d]{24})\/events/
    const readByRegx = /\/api\/v1\/rooms\/[a-f\d]{24}\/chatMessages\/[a-f\d]{24}\/readBy/
    const readByRegxIds = /\/api\/v1\/rooms\/([a-f\d]{24})\/chatMessages\/([a-f\d]{24})\/readBy/

    if (sbs.match(roomsRegx)) {
      dispatch(receiveRoomsSnapshot(message.ext.snapshot))
    }

    if (sbs.match(messagesRegx)) {
      const id = sbs.match(messagesRegxIds)[1]
      dispatch(receiveRoomMessagesSnapshot(id, message.ext.snapshot))
    }

    if (sbs.match(eventsRegx)) {
      const id = sbs.match(eventsRegxIds)[1]
      dispatch(receiveRoomEventsSnapshot(id, message.ext.snapshot))
    }
    //
    if (sbs.match(readByRegx)) {
      const messageId = sbs.match(readByRegxIds)[2]
      dispatch(receiveReadBySnapshot(messageId, message.ext.snapshot))
    }
  }
}

/**
 * Subscribe current user rooms changes (Drawer)
 */

export function subscribeToRooms() {
  return (dispatch, getState) => {
    const {id} = getState().viewer.user
    FayeGitter.subscribe(`/api/v1/user/${id}/rooms`)
    dispatch({type: ROOMS_SUBSCRIBED})
  }
}

/**
 * Subscribe for new room's messages => faye chat messages endpoint
 */

export function subscribeToChatMessages(roomId) {
  return dispatch => {
    FayeGitter.subscribe(`/api/v1/rooms/${roomId}/chatMessages`)
    dispatch({type: SUBSCRIBE_TO_CHAT_MESSAGES, roomId})
  }
}

/**
 * Unsubscribe for new room's messages => faye chat messages endpoint
 */

export function unsubscribeToChatMessages(roomId) {
  return (dispatch) => {
    FayeGitter.unsubscribe(`/api/v1/rooms/${roomId}/chatMessages`)
    dispatch({type: UNSUBSCRIBE_TO_CHAT_MESSAGES, roomId})
  }
}


export function subscribeToRoomEvents(roomId) {
  return dispatch => {
    FayeGitter.subscribe(`/api/v1/rooms/${roomId}/events`)
    dispatch({type: SUBSCRIBE_TO_ROOM_EVENTS, roomId})
  }
}

/**
 * Unsubscribe for new room's messages => faye chat messages endpoint
 */

export function unsubscribeToRoomEvents(roomId) {
  return (dispatch) => {
    FayeGitter.unsubscribe(`/api/v1/rooms/${roomId}/events`)
    dispatch({type: UNSUBSCRIBE_TO_ROOM_EVENTS, roomId})
  }
}

export function subscribeToReadBy(roomId, messageId) {
  return dispatch => {
    FayeGitter.subscribe(`/api/v1/rooms/${roomId}/chatMessages/${messageId}/readBy`)
    dispatch({type: SUBSCRIBE_TO_READ_BY, roomId})
  }
}

/**
 * Unsubscribe for new room's messages => faye chat messages endpoint
 */

export function unsubscribeFromReadBy(roomId, messageId) {
  return (dispatch) => {
    FayeGitter.unsubscribe(`/api/v1/rooms/${roomId}/chatMessages/${messageId}/readBy`)
    dispatch({type: UNSUBSCRIBE_FROM_READ_BY, roomId})
  }
}

/**
 * Reducer
 */

const initialState = {
  fayeConnected: false,
  roomsSubscribed: false,
  roomMessagesSubscription: ''
}

export default function realtime(state = initialState, action) {
  switch (action.type) {
  case FAYE_CONNECT:
    return {...state,
      fayeConnected: action.payload
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
