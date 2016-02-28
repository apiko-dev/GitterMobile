import * as Api from '../api/gitter'
import normalize from '../utils/normalize'
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
export const PREPARE_LIST_VIEW = 'messages/PREPARE_LIST_VIEW'

/**
 * Action creators
 */

/**
 * Returns first $LIMIT$ messages by room id
 */

export function getRoomMessages(roomId) {
  return async (dispatch, getState) => {
    const {token} = getState().auth
    dispatch({type: ROOM_MESSAGES, payload: roomId})
    try {
      const payload = await Api.roomMessages(token, roomId)
      dispatch({type: ROOM_MESSAGES_RECEIVED, roomId, payload})
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
    const lastMessageId = byRoom[roomId][0]
    dispatch({type: ROOM_MESSAGES_BEFORE, payload: roomId})
    try {
      const payload = await Api.roomMessagesBefore(token, roomId, lastMessageId)

      if (payload.length === 0) {
        dispatch({type: ROOM_HAS_NO_MORE_MESSAGES, roomId})
      } else {
        dispatch({type: ROOM_MESSAGES_BEFORE_RECEIVED, roomId, payload})
      }
    } catch (error) {
      dispatch({type: ROOM_MESSAGES_BEFORE_FAILED, error})
    }
  }
}

/**
 * Action that needs to pass DataSource object into state.listView.dataSource
 */

export function prepareListView(ds) {
  return {
    type: PREPARE_LIST_VIEW, payload: ds
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
    dataSource: null,
    data: [],
    rowIds: []
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
      listView: {
        dataSource: state.listView.dataSource.cloneWithRows(data, rowIds),
        data,
        rowIds
      }
    }
  }

  case ROOM_MESSAGES_BEFORE_RECEIVED: {
    const {payload, roomId} = action
    const {ids, entities} = normalize(payload)
    const byRoom = state.byRoom[roomId]

    const rowIds = [].concat(state.listView.rowIds)
    const data = [].concat(state.listView.data)
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
      listView: {
        dataSource: state.listView.dataSource.cloneWithRows(data, rowIds),
        data,
        rowIds
      }
    }
  }

  case ROOM_HAS_NO_MORE_MESSAGES: {
    const rowIds = [].concat(state.listView.rowIds)
    const data = [].concat(state.listView.data)
    data.push({hasNoMore: true})
    rowIds.push(data.length - 1)

    return {...state,
      isLoadingMore: false,
      hasNoMore: {...state.hasNoMore, [action.roomId]: true},
      listView: {
        dataSource: state.listView.dataSource.cloneWithRows(data, rowIds),
        data,
        rowIds
      }
    }
  }

  case PREPARE_LIST_VIEW:
    return {...state,
      listView: {
        dataSource: action.payload,
        data: [],
        rowIds: []
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
