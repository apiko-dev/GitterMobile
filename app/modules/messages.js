import * as Api from '../api/gitter'
import normalize from '../utils/normalize'
import _ from 'lodash'
import FayeGitter from '../../libs/react-native-gitter-faye'

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
export const SUBSCRIBE_TO_CHAT_MESSAGES = 'messages/SUBSCRIBE_TO_CHAT_MESSAGES'

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
    } catch (error) {
      dispatch({type: ROOM_MESSAGES_BEFORE_FAILED, error})
    }
  }
}

export function getRoomMessagesIfNeeded(roomId) {
  return async (dispatch, getState) => {
    const {token} = getState().auth
    const {listView} = getState().messages
    const {limit} = getState().settings
    const {data} = listView[roomId]

    dispatch({type: ROOM_MESSAGES_RETURN_FROM_CACHE, roomId})

    try {
      const payload = await Api.roomMessages(token, roomId, limit)

      if (_.findIndex(data, payload[0]) !== -1
          && _.findIndex(data, _.last(payload)) !== -1) {
        dispatch({type: ROOM_MESSAGES_RETURN_FROM_CACHE, roomId})
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
          dispatch({type: ROOM_HAS_NO_MORE_MESSAGES, roomId})
        } else {
          dispatch({type: ROOM_MESSAGES_RECEIVED, roomId, payload})
          if (payload.length < limit) {
            dispatch({type: ROOM_HAS_NO_MORE_MESSAGES, roomId})
          }
        }
      }
    } catch (error) {
      dispatch({type: ROOM_MESSAGES_FAILED, error})
    }
  }
}

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

export function subscribeToChatMessages(roomId) {
  return (dispatch, getState) => {
    FayeGitter.subscribe(`/api/v1/rooms/${roomId}/chatMessages`)
    dispatch({type: SUBSCRIBE_TO_CHAT_MESSAGES, roomId})
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
  }
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

  case ROOM_HAS_NO_MORE_MESSAGES: {
    const {roomId} = action
    const rowIds = [].concat(state.listView[roomId].rowIds)
    const data = [].concat(state.listView[roomId].data)
    data.push({hasNoMore: true})
    rowIds.push(data.length - 1)

    return {...state,
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

  case ROOM_MESSAGES_RETURN_FROM_CACHE:
    return {...state,
      isLoading: false
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

  case ROOM_MESSAGES_BEFORE_FAILED:
  case ROOM_MESSAGES_FAILED:
    return {...state,
      isLoading: false,
      error: true,
      errors: action.error
    }

  default:
    return state
  }
}
