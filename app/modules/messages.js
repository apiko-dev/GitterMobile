import * as Api from '../api/gitter'
import normalize from '../utils/normalize'
import {createMessage, createStatusMessage} from '../utils/createMessage'
import _ from 'lodash'

/**
 * Constants
 */

export const ROOM_MESSAGES = 'messages/ROOM_MESSAGES'
export const ROOM_MESSAGES_RECEIVED = 'messages/ROOM_MESSAGES_RECEIVED'
export const ROOM_MESSAGES_FAILED = 'messages/ROOM_MESSAGES_FAILED'
export const ROOM_MESSAGES_BEFORE = 'messages/ROOM_MESSAGES_BEFORE'
export const ROOM_MESSAGES_BEFORE_RECEIVED = 'messages/ROOM_MESSAGES_BEFORE_RECEIVED'
export const ROOM_MESSAGES_BEFORE_FAILED = 'messages/ROOM_MESSAGES_BEFORE_FAILED'
export const ROOM_HAS_NO_MORE_MESSAGES = 'messages/ROOM_HAS_NO_MORE_MESSAGES'
export const ROOM_MESSAGES_RETURN_FROM_CACHE = 'messages/ROOM_MESSAGES_RETURN_FROM_CACHE'
export const ROOM_MESSAGES_APPEND = 'messages/ROOM_MESSAGES_APPEND'
export const PREPARE_LIST_VIEW = 'messages/PREPARE_LIST_VIEW'
export const SEND_MESSAGE = 'messages/SEND_MESSAGE'
export const SEND_MESSAGE_RECEIVED = 'messages/SEND_MESSAGE_RECEIVED'
export const SEND_MESSAGE_FAILED = 'messages/SEND_MESSAGE_FAILED'
export const RESEND_MESSAGE = 'messages/RESEND_MESSAGE'
export const RESEND_MESSAGE_OK = 'messages/RESEND_MESSAGE_OK'
export const UPDATE_MESSAGE = 'messages/UPDATE_MESSAGE'
export const UPDATE_MESSAGE_OK = 'messages/UPDATE_MESSAGE_OK'
export const UPDATE_MESSAGE_FAILED = 'messages/UPDATE_MESSAGE_FAILED'
export const CLEAR_ERROR = 'messages/CLEAR_ERROR'
export const GETTING_MORE_MESSAGES = 'messages/GETTING_MORE_MESSAGES'
export const GETTING_MORE_MESSAGES_OK = 'messages/GETTING_MORE_MESSAGES_OK'
export const DELETE_MESSAGE = 'messages/DELETE_MESSAGE'
export const SINGLE_MESSAGE = 'messages/SINGLE_MESSAGE'
export const SINGLE_MESSAGE_OK = 'messages/SINGLE_MESSAGE_OK'
export const SINGLE_MESSAGE_ERROR = 'messages/SINGLE_MESSAGE_ERROR'
export const RECEIVE_ROOM_MESSAGES_SNAPSHOT = 'messages/RECEIVE_ROOM_MESSAGES_SNAPSHOT'
export const READ_MESSAGES = 'messages/READ_MESSAGES'
export const READ_MESSAGES_OK = 'messages/READ_MESSAGES_OK'
export const READ_MESSAGES_ERROR = 'messages/READ_MESSAGES_ERROR'


/**
 * Action creators
 */

/**
 * Returns first $LIMIT$ messages by room id
 */

export function getRoomMessages(roomId) {
  return async (dispatch, getState) => {
    const {token} = getState().auth
    const {limit} = getState().settings
    dispatch({type: ROOM_MESSAGES, payload: roomId})
    try {
      const payload = await Api.roomMessages(token, roomId, limit)
      if (payload.length === 0) {
        dispatch({type: ROOM_HAS_NO_MORE_MESSAGES, roomId})
      } else {
        dispatch({type: ROOM_MESSAGES_RECEIVED, roomId, payload})
        if (payload.length < limit) {
          dispatch({type: ROOM_HAS_NO_MORE_MESSAGES, roomId})
        }
      }
    } catch (error) {
      dispatch({type: ROOM_MESSAGES_FAILED, error})
    }
  }
}

/**
 * Returns messages that are before oldest message
 */

export function getRoomMessagesBefore(roomId) {
  return async (dispatch, getState) => {
    const {token} = getState().auth
    const {byRoom} = getState().messages
    const {limit} = getState().settings
    const lastMessageId = byRoom[roomId][0]
    dispatch({type: GETTING_MORE_MESSAGES})
    dispatch({type: ROOM_MESSAGES_BEFORE, payload: roomId})
    try {
      const payload = await Api.roomMessagesBefore(token, roomId, limit, lastMessageId)

      if (payload.length === 0) {
        dispatch({type: ROOM_HAS_NO_MORE_MESSAGES, roomId})
      } else {
        dispatch({type: ROOM_MESSAGES_BEFORE_RECEIVED, roomId, payload})
        if (payload.length < limit) {
          dispatch({type: ROOM_HAS_NO_MORE_MESSAGES, roomId})
        }
      }
      dispatch({type: GETTING_MORE_MESSAGES_OK})
    } catch (error) {
      dispatch({type: ROOM_MESSAGES_BEFORE_FAILED, error})
    }
  }
}

/**
 * Updates listView if needed
 */

export function getRoomMessagesIfNeeded(roomId) {
  return async (dispatch, getState) => {
    const {token} = getState().auth
    const {listView} = getState().messages
    const {limit} = getState().settings
    const {data} = listView[roomId]
    dispatch({type: GETTING_MORE_MESSAGES})

    dispatch({type: ROOM_MESSAGES_RETURN_FROM_CACHE, roomId, limit})

    try {
      const payload = await Api.roomMessages(token, roomId, limit)
      if (payload.length === 0) {
        dispatch({type: ROOM_MESSAGES_RETURN_FROM_CACHE, roomId, limit})
      } else {
        if (_.findIndex(data, payload[0]) !== -1
            && _.findIndex(data, _.last(payload)) !== -1) {
          dispatch({type: ROOM_MESSAGES_RETURN_FROM_CACHE, roomId, limit})
        } else if (_.findIndex(data, payload[0]) === -1
          && _.findIndex(data, _.last(payload)) !== -1) {
          const newMessages = payload.map(item => {
            if (_.findIndex(data, item) === -1) {
              return item
            }
          })

          dispatch({type: ROOM_MESSAGES_APPEND, roomId, payload: newMessages})
        } else {
          if (payload.length === 0) {
            dispatch({type: ROOM_MESSAGES_RETURN_FROM_CACHE, roomId, limit})
          } else {
            dispatch({type: ROOM_MESSAGES_RECEIVED, roomId, payload})
            if (payload.length < limit) {
              dispatch({type: ROOM_HAS_NO_MORE_MESSAGES, roomId})
            }
          }
        }
      }
    } catch (error) {
      dispatch({type: ROOM_MESSAGES_FAILED, error})
    } finally {
      dispatch({type: GETTING_MORE_MESSAGES_OK})
    }
  }
}

export function receiveRoomMessagesSnapshot(roomId, snapshot) {
  return (dispatch, getState) => {
    const listView = getState().messages.listView[roomId]
    if (!listView.data.length | !snapshot.length) {
      return
    }

    const index = _.findIndex(snapshot, listView.data[0])
    if (index === -1 | index === 29) {
      return
    }

    dispatch({type: RECEIVE_ROOM_MESSAGES_SNAPSHOT, roomId, index, snapshot})
  }
}

/**
 * Appending new messages at the begining of list
 */

export function appendMessages(roomId, payload) {
  return {
    type: ROOM_MESSAGES_APPEND, payload: [...payload], roomId
  }
}

/**
 * Action that needs to pass DataSource object into state.listView.dataSource
 */

export function prepareListView(roomId, ds) {
  return {
    type: PREPARE_LIST_VIEW, payload: ds, roomId
  }
}


/**
 * Send messages
 */

export function sendMessage(roomId, text) {
  return async (dispatch, getState) => {
    const {token} = getState().auth
    const {user} = getState().viewer
    const message = createMessage(user, text)
    dispatch({type: SEND_MESSAGE, roomId, message})

    try {
      const payload = await Api.sendMessage(token, roomId, text)
      dispatch({type: SEND_MESSAGE_RECEIVED, message, roomId, payload})
    } catch (error) {
      dispatch({type: SEND_MESSAGE_FAILED, error, message, roomId})
    }
  }
}

/**
 * Send messages
 */

export function sendStatusMessage(roomId, rawText) {
  return async (dispatch, getState) => {
    const {token} = getState().auth
    const {user} = getState().viewer
    const text = rawText.replace('/me', `@${user.username}`)
    const message = createStatusMessage(user, text)
    dispatch({type: SEND_MESSAGE, roomId, message})

    try {
      const payload = await Api.sendStatusMessage(token, roomId, text)
      dispatch({type: SEND_MESSAGE_RECEIVED, message, roomId, payload})
    } catch (error) {
      dispatch({type: SEND_MESSAGE_FAILED, error, message, roomId})
    }
  }
}

/**
 * Resend messages
 */

export function updateMessage(roomId, messageId, text) {
  return async (dispatch, getState) => {
    const {token} = getState().auth
    dispatch({type: UPDATE_MESSAGE, roomId, messageId, text})

    try {
      const payload = await Api.updateMessage(token, roomId, messageId, text)
      dispatch({type: UPDATE_MESSAGE_OK, payload, roomId, messageId})
    } catch (error) {
      dispatch({type: UPDATE_MESSAGE_OK, error, roomId, messageId})
    }
  }
}

/**
 * Update message
 */

export function resendMessage(roomId, rowId, text) {
  return async (dispatch, getState) => {
    const {token} = getState().auth
    const {user} = getState().viewer
    const message = createMessage(user, text)
    dispatch({type: RESEND_MESSAGE, roomId, message, rowId})

    try {
      const payload = await Api.sendMessage(token, roomId, text)
      dispatch({type: DELETE_MESSAGE, rowId, roomId})
      dispatch({type: RESEND_MESSAGE_OK, roomId, payload})
    } catch (error) {
      dispatch({type: SEND_MESSAGE_FAILED, error, message, roomId})
    }
  }
}

/**
 * Update message by faye event
 */

export function updateMessageRealtime(roomId, message) {
  return dispatch => {
    const {id} = message
    dispatch({type: UPDATE_MESSAGE, roomId, messageId: id})
    const payload = message
    dispatch({type: UPDATE_MESSAGE_OK, payload, roomId, messageId: id})
  }
}

/**
 * An actionc creator for clear all the errors
 */

export function clearError() {
  return {
    type: CLEAR_ERROR
  }
}

export function deleteFailedMessage(rowId, roomId) {
  return {
    type: DELETE_MESSAGE,
    rowId,
    roomId
  }
}

export function getSingleMessage(roomId, messageId) {
  return async (dispatch, getState) => {
    const {token} = getState().auth
    dispatch({type: SINGLE_MESSAGE, roomId, messageId})

    try {
      const payload = await Api.getMessage(token, roomId, messageId)
      dispatch({type: SINGLE_MESSAGE_OK, roomId, messageId, payload})
    } catch (error) {
      dispatch({type: SINGLE_MESSAGE_ERROR, error, messageId, roomId})
    }
  }
}

export function readMessages(roomId, changedRows) {
  return async (dispatch, getState) => {
    const {token} = getState().auth
    const {id} = getState().viewer.user
    const listView = getState().messages.listView[roomId]

    const visibleAndUnread = Object.keys(changedRows)
      .filter(rowId => (changedRows[rowId] === true))
      .filter(rowId => (listView.data[rowId].unread === true))

    if (!visibleAndUnread.length) {
      return
    }

    dispatch({type: READ_MESSAGES, roomId, visibleAndUnread})

    try {
      await Api.readMessages(
        token, id, roomId, visibleAndUnread.map(item => listView.data[item].id)
      )
      dispatch({type: READ_MESSAGES_OK, roomId, visibleAndUnread})
    } catch (error) {
      dispatch({type: READ_MESSAGES_ERROR, error: error.message, roomId, visibleAndUnread})
    }
  }
}


/**
 * Reducer
 */


const initialState = {
  isLoading: false,
  isLoadingMore: false,
  error: false,
  errors: {},
  byRoom: {
    // [id]: []
  },
  entities: {},
  listView: {
    // [id]: {}
  },
  hasNoMore: {
    // [id]: bool
  },
  isLoadingMessage: false,
  messages: {}
}

export default function messages(state = initialState, action) {
  switch (action.type) {
  case ROOM_MESSAGES:
    return {...state,
      isLoading: true
    }

  case ROOM_MESSAGES_BEFORE:
    return {...state,
      isLoadingMore: true
    }

  case GETTING_MORE_MESSAGES:
    return {...state,
      isLoadingMore: true
    }

  case GETTING_MORE_MESSAGES_OK:
    return {...state,
      isLoadingMore: false
    }

  case ROOM_MESSAGES_RECEIVED: {
    const {payload, roomId} = action
    const {ids, entities} = normalize(payload)
    const rowIds = []
    const data = []
    // we need to reverse our messages array to display it inverted
    const reversedIds = [].concat(ids).reverse()
    for (let i = 0; i < reversedIds.length; i++) {
      data.push(entities[reversedIds[i]])
      rowIds.push(data.length - 1)
    }
    return {...state,
      isLoading: false,
      byRoom: {...state.byRoom, [roomId]: [...ids]},
      entities: _.merge({}, state.entities, entities),
      listView: {...state.listView,
        [roomId]: {
          dataSource: state.listView[roomId].dataSource.cloneWithRows(data, rowIds),
          data,
          rowIds
        }
      }
    }
  }

  case ROOM_MESSAGES_BEFORE_RECEIVED: {
    const {payload, roomId} = action
    const {ids, entities} = normalize(payload)
    const byRoom = state.byRoom[roomId]

    const rowIds = [].concat(state.listView[roomId].rowIds)
    const data = [].concat(state.listView[roomId].data)
    // we need to reverse our messages array to display it inverted
    const reversedIds = [].concat(ids).reverse()
    for (let i = 0; i < reversedIds.length; i++) {
      data.push(entities[reversedIds[i]])
      rowIds.push(data.length - 1)
    }
    return {...state,
      isLoadingMore: false,
      byRoom: {...state.byRoom,
        [roomId]: ids.concat(byRoom)
      },
      entities: _.merge({}, state.entities, entities),
      listView: {...state.listView,
        [roomId]: {
          dataSource: state.listView[roomId].dataSource.cloneWithRows(data, rowIds),
          data,
          rowIds
        }
      }
    }
  }

  case ROOM_MESSAGES_APPEND: {
    const {payload, roomId} = action
    const {ids, entities} = normalize(payload)
    const byRoom = state.byRoom[roomId]

    const rowIds = [].concat(state.listView[roomId].rowIds)
    const data = [].concat(state.listView[roomId].data)
    // we need to reverse our messages array to display it inverted
    const reversedIds = [].concat(ids).reverse()
    for (let i = 0; i < reversedIds.length; i++) {
      data.push(entities[reversedIds[i]])
      rowIds.unshift(data.length - 1)
    }
    return {...state,
      isLoadingMore: false,
      byRoom: {...state.byRoom,
        [roomId]: byRoom.concat(ids)
      },
      entities: _.merge({}, state.entities, entities),
      listView: {...state.listView,
        [roomId]: {
          dataSource: state.listView[roomId].dataSource.cloneWithRows(data, rowIds),
          data,
          rowIds
        }
      }
    }
  }

  case RECEIVE_ROOM_MESSAGES_SNAPSHOT: {
    const {snapshot, index, roomId} = action
    const {ids, entities} = normalize(snapshot.slice(index))
    const byRoom = state.byRoom[roomId]

    const rowIds = [].concat(state.listView[roomId].rowIds)
    const data = [].concat(state.listView[roomId].data)
    // we need to reverse our messages array to display it inverted
    const reversedIds = [].concat(ids).reverse()
    for (let i = 0; i < reversedIds.length; i++) {
      data.push(entities[reversedIds[i]])
      rowIds.unshift(data.length - 1)
    }
    return {...state,
      isLoadingMore: false,
      byRoom: {...state.byRoom,
        [roomId]: byRoom.concat(ids)
      },
      entities: _.merge({}, state.entities, entities),
      listView: {...state.listView,
        [roomId]: {
          dataSource: state.listView[roomId].dataSource.cloneWithRows(data, rowIds),
          data,
          rowIds
        }
      }
    }
  }

  case ROOM_HAS_NO_MORE_MESSAGES: {
    const {roomId} = action
    const rowIds = [].concat(state.listView[roomId].rowIds)
    const data = [].concat(state.listView[roomId].data)
    data.push({hasNoMore: true})
    rowIds.push(data.length - 1)

    return {...state,
      isLoading: false,
      isLoadingMore: false,
      hasNoMore: {...state.hasNoMore, [action.roomId]: true},
      listView: {...state.listView,
        [action.roomId]: {
          dataSource: state.listView[roomId].dataSource.cloneWithRows(data, rowIds),
          data,
          rowIds
        }
      }
    }
  }

  case ROOM_MESSAGES_RETURN_FROM_CACHE: {
    const {roomId, limit} = action
    const {byRoom, entities} = state
    const rowIds = []
    const data = []
    let hasNoMore = _.merge({}, state.hasNoMore)

    if (!byRoom[roomId]) {
      return state
    }
    // we need to reverse our messages array to display it inverted
    const reversedIds = [].concat(byRoom[roomId]).reverse()
    for (let i = 0; i < reversedIds.length && i < 30; i++) {
      data.push(entities[reversedIds[i]])
      rowIds.push(data.length - 1)
    }
    if (reversedIds.length < limit) {
      data.push({hasNoMore: true})
      rowIds.push(data.length - 1)
      hasNoMore = {...state.hasNoMore, [roomId]: true}
    }

    return {...state,
      hasNoMore,
      isLoading: false,
      listView: {...state.listView,
        [roomId]: {
          dataSource: state.listView[roomId].dataSource.cloneWithRows(data, rowIds),
          data,
          rowIds
        }
      }
    }
  }


  case PREPARE_LIST_VIEW:
    return {...state,
      listView: {...state.listView,
        [action.roomId]: {
          dataSource: action.payload,
          data: [],
          rowIds: []
        }
      }
    }

  case SEND_MESSAGE: {
    const {message, roomId} = action

    const rowIds = [].concat(state.listView[roomId].rowIds)
    const data = [].concat(state.listView[roomId].data)

    data.push(message)
    rowIds.unshift(data.length - 1)
    return {...state,
      listView: {...state.listView,
        [roomId]: {
          dataSource: state.listView[roomId].dataSource.cloneWithRows(data, rowIds),
          data,
          rowIds
        }
      }
    }
  }

  case SEND_MESSAGE_RECEIVED: {
    const {message, roomId, payload} = action
    const {ids, entities} = normalize([payload])
    const byRoom = state.byRoom[roomId]
    const rowIds = [].concat(state.listView[roomId].rowIds)
    const data = [].concat(state.listView[roomId].data)

    const index = _.findIndex(data, message)

    data[index] = payload

    return {...state,
      byRoom: {...state.byRoom,
        [roomId]: byRoom.concat(ids)
      },
      entities: _.merge({}, state.entities, entities),
      listView: {...state.listView,
        [roomId]: {
          dataSource: state.listView[roomId].dataSource.cloneWithRows(data, rowIds),
          data,
          rowIds
        }
      }
    }
  }

  case RESEND_MESSAGE_OK: {
    const {roomId, payload} = action
    const {ids, entities} = normalize([payload])
    const byRoom = state.byRoom[roomId]
    const rowIds = [].concat(state.listView[roomId].rowIds)
    const data = [].concat(state.listView[roomId].data)

    data.push(payload)
    rowIds.unshift(data.length - 1)

    return {...state,
      byRoom: {...state.byRoom,
        [roomId]: byRoom.concat(ids)
      },
      entities: _.merge({}, state.entities, entities),
      listView: {...state.listView,
        [roomId]: {
          dataSource: state.listView[roomId].dataSource.cloneWithRows(data, rowIds),
          data,
          rowIds
        }
      }
    }
  }

  case SEND_MESSAGE_FAILED: {
    const {message, roomId, error} = action

    const rowIds = [].concat(state.listView[roomId].rowIds)
    const data = [].concat(state.listView[roomId].data)
    const newMessage = _.merge({}, message)
    const index = _.findIndex(data, message)
    newMessage.failed = true
    newMessage.sending = false
    newMessage.sent = 'failed'
    data[index] = newMessage

    return {...state,
      listView: {...state.listView,
        [roomId]: {
          dataSource: state.listView[roomId].dataSource.cloneWithRows(data, rowIds),
          data,
          rowIds
        }
      }
    }
  }

  case RESEND_MESSAGE: {
    const {message, roomId, rowId} = action
    const rowIds = [].concat(state.listView[roomId].rowIds)
    const data = [].concat(state.listView[roomId].data)
    const newMessage = _.merge({}, message)

    data[rowId] = newMessage

    return {...state,
      listView: {...state.listView,
        [roomId]: {
          dataSource: state.listView[roomId].dataSource.cloneWithRows(data, rowIds),
          data,
          rowIds
        }
      }
    }
  }

  case DELETE_MESSAGE: {
    const {roomId, rowId} = action
    const rowIds = [].concat(state.listView[roomId].rowIds).filter(id => id !== rowId)
    const data = [].concat(state.listView[roomId].data)
    data.splice(rowId, 1)

    return {...state,
      listView: {...state.listView,
        [roomId]: {
          dataSource: state.listView[roomId].dataSource.cloneWithRows(data, rowIds),
          data,
          rowIds
        }
      }
    }
  }

  case UPDATE_MESSAGE_OK: {
    const {messageId, roomId, payload} = action

    const rowIds = [].concat(state.listView[roomId].rowIds)
    const data = [].concat(state.listView[roomId].data)
    const rowId = _.findIndex(data, ['id', messageId])

    const message = data[rowId]
    const newMessage = _.merge({}, message, payload)
    data[rowId] = newMessage

    return {...state,
      entities: {...state.entities,
        [messageId]: newMessage
      },
      listView: {...state.listView,
        [roomId]: {
          dataSource: state.listView[roomId].dataSource.cloneWithRows(data, rowIds),
          data,
          rowIds
        }
      }
    }
  }

  case READ_MESSAGES_OK: {
    const {roomId, visibleAndUnread} = action

    const rowIds = [].concat(state.listView[roomId].rowIds)
    const data = [].concat(state.listView[roomId].data)

    visibleAndUnread.forEach(rowId => data[rowId] = Object.assign({}, data[rowId], {unread: false}))

    return {...state,
      listView: {...state.listView,
        [roomId]: {
          dataSource: state.listView[roomId].dataSource.cloneWithRows(data, rowIds),
          data,
          rowIds
        }
      }
    }
  }


  case CLEAR_ERROR: {
    return {...state,
      error: false,
      errors: []
    }
  }

  case SINGLE_MESSAGE:
    return {...state,
      isLoadingMessage: true
    }

  case SINGLE_MESSAGE_OK:
    return {...state,
      isLoadingMessage: false,
      messages: {...state.messages,
        [action.messageId]: action.payload
      }
    }

  case SINGLE_MESSAGE_ERROR:
  case ROOM_MESSAGES_BEFORE_FAILED:
  case ROOM_MESSAGES_FAILED:
    return {...state,
      isLoading: false,
      isLoadingMore: false,
      isLoadingMessage: false,
      error: true,
      errors: action.error
    }

  default:
    return state
  }
}
