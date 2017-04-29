import * as Api from '../api/gitter'
import normalize from '../utils/normalize'
import {joinUserRoom} from './rooms'
import * as Navigation from './navigation'
import _ from 'lodash'

/**
 * Constants
 */

export const USER = 'users/USER'
export const USER_OK = 'users/USER_OK'
export const USER_FAILED = 'users/USER_FAILED'
export const CHAT_PRIVATELY = 'users/CHAT_PRIVATELY'
export const CHAT_PRIVATELY_OK = 'users/CHAT_PRIVATELY_OK'
export const CHAT_PRIVATELY_FAILED = 'users/CHAT_PRIVATELY_FAILED'
export const ROOM_USERS = 'users/ROOM_USERS'
export const ROOM_USERS_OK = 'users/ROOM_USERS_OK'
export const ROOM_USERS_FAILED = 'users/ROOM_USERS_FAILED'
export const PREPARE_LIST_VIEW = 'users/PREPARE_LIST_VIEW'
export const ROOM_USERS_WITH_SKIP = 'users/ROOM_USERS_WITH_SKIP'
export const ROOM_USERS_WITH_SKIP_OK = 'users/ROOM_USERS_WITH_SKIP_OK'
export const ROOM_USERS_WITH_SKIP_ERROR = 'users/ROOM_USERS_WITH_SKIP_ERROR'
export const NO_MORE_USERS_TO_LOAD = 'users/NO_MORE_USERS_TO_LOAD'


/**
 * Actions
 */

export function getUser(username) {
  return async (dispatch, getState) => {
    const {token} = getState().auth
    dispatch({type: USER, username})

    try {
      const payload = await Api.getUser(token, username)
      dispatch({type: USER_OK, payload})
    } catch (error) {
      dispatch({type: USER_FAILED, error})
    }
  }
}

export function chatPrivately(userId, navigator) {
  return async (dispatch, getState) => {
    dispatch({type: CHAT_PRIVATELY, userId})
    const room = _.find(getState().rooms.rooms, {user: {id: userId}})

    try {
      if (typeof room !== 'undefined') {
        navigator.push({screen: 'gm.Room', passProps: {roomId: room.id}})
      } else {
        const {username} = getState().users.entities[userId]
        await dispatch(joinUserRoom(username))
        const newRoom = _.find(getState().rooms.rooms, {user: {id: userId}})
        navigator.push({screen: 'gm.Room', passProps: {roomId: newRoom.id}})
      }
      dispatch({type: CHAT_PRIVATELY_OK, userId})
    } catch (error) {
      dispatch({type: CHAT_PRIVATELY_FAILED, error})
    }
  }
}

export function roomUsers(roomId) {
  return async (dispatch, getState) => {
    const {token} = getState().auth
    dispatch({type: ROOM_USERS, roomId})

    try {
      const payload = await Api.getRoomUsers(token, roomId)
      dispatch({type: ROOM_USERS_OK, payload, roomId})
    } catch (error) {
      dispatch({type: ROOM_USERS_FAILED, error, roomId})
    }
  }
}

export function prepareListView(roomId, dataSource) {
  return {
    type: PREPARE_LIST_VIEW, dataSource, roomId
  }
}

export function roomUsersWithSkip(roomId) {
  return async (dispatch, getState) => {
    if (getState().users.noMore[roomId] === true) {
      return
    }

    const {token} = getState().auth
    const {usersLimit} = getState().settings
    const {ids} = getState().users.byRoom[roomId]
    const skip = ids.length

    dispatch({type: ROOM_USERS_WITH_SKIP, roomId, skip})
    try {
      const payload = await Api.getRoomUsersWithSkip(token, roomId, skip)

      if (payload.length === 0) {
        dispatch({type: NO_MORE_USERS_TO_LOAD, roomId})
      } else {
        dispatch({type: ROOM_USERS_WITH_SKIP_OK, roomId, payload})
        if (payload.length < usersLimit) {
          dispatch({type: NO_MORE_USERS_TO_LOAD, roomId})
        }
      }
    } catch (error) {
      dispatch({type: ROOM_USERS_WITH_SKIP_ERROR, error})
    }
  }
}


/**
 * Reducer
 */

const initialState = {
  isLoadingUser: false,
  isLoadingUsers: false,
  ids: [],
  entities: {},
  byRoom: {
    // [roomId]: {
    //   ids: [],
    //   entities: {}
    // }
  },
  listView: {
    // [roomId]: {
    //   dataSource,
    //   rowIds,
    //   data
    // }
  },
  noMore: {},
  error: false,
  errors: {}
}

export default function users(state = initialState, action) {
  switch (action.type) {
  case USER:
    return {...state,
      isLoadingUser: true
    }

  case ROOM_USERS:
    return {...state,
      isLoadingUsers: true
    }

  case USER_OK: {
    const {payload} = action
    return {...state,
      isLoadingUser: false,
      ids: state.ids.concat(payload.id),
      entities: {...state.entities,
        [payload.id]: payload
      }
    }
  }

  case ROOM_USERS_OK: {
    const {payload, roomId} = action
    const {ids, entities} = normalize(payload)
    return {...state,
      isLoadingUsers: false,
      byRoom: {...state.byRoom,
        [roomId]: {
          ids,
          entities
        }
      }
    }
  }

  case PREPARE_LIST_VIEW: {
    const {roomId, dataSource} = action
    const data = []
    const rowIds = []
    const {entities, ids} = state.byRoom[roomId]

    for (let i = 0; i < ids.length && i < 30; i++) {
      data.push(entities[ids[i]])
      rowIds.push(data.length - 1)
    }

    return {...state,
      listView: {...state.listView,
        [roomId]: {
          dataSource: dataSource.cloneWithRows(data, rowIds),
          data,
          rowIds
        }
      }
    }
  }

  case ROOM_USERS_WITH_SKIP_OK: {
    const {roomId, payload} = action
    const listView = state.listView[roomId]
    const byRoom = state.byRoom[roomId]
    const data = [].concat(listView.data)
    const rowIds = [].concat(listView.rowIds)

    const {ids, entities} = normalize(payload)

    for (let i = 0; i < ids.length && i < 30; i++) {
      data.push(entities[ids[i]])
      rowIds.push(data.length - 1)
    }

    return {...state,
      byRoom: {...state.byRoom,
        [roomId]: {
          ids: byRoom.ids.concat(ids),
          entities: Object.assign({}, byRoom.entities, entities)
        }
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

  case NO_MORE_USERS_TO_LOAD:
    return {...state,
      noMore: {...state.noMore,
        [action.roomId]: true
      }
    }

  case ROOM_USERS_WITH_SKIP_ERROR:
  case ROOM_USERS_FAILED:
  case USER_FAILED:
    return {...state,
      isLoadingUser: false,
      isLoadingUsers: false,
      error: true,
      errors: action.error
    }
  default:
    return state
  }
}
