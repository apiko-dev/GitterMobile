import * as Api from '../api/gitter'
import _ from 'lodash'
import FayeGitter from '../../libs/react-native-gitter-faye'
import normalize from '../utils/normalize'
import {LOGOUT} from './auth'


/**
 * Constants
 */

export const CURRENT_USER_ROOMS = 'rooms/CURRENT_USER_ROOMS'
export const CURRENT_USER_ROOMS_RECEIVED = 'rooms/CURRENT_USER_ROOMS_RECEIVED'
export const CURRENT_USER_ROOMS_FAILED = 'rooms/CURRENT_USER_ROOMS_FAILED'
export const SUGGESTED_ROOMS = 'rooms/SUGGESTED_ROOMS'
export const SUGGESTED_ROOMS_RECEIVED = 'rooms/SUGGESTED_ROOMS_RECEIVED'
export const SUGGESTED_ROOMS_FAILED = 'rooms/SUGGESTED_ROOMS_FAILED'
export const SELECT_ROOM = 'rooms/SELECT_ROOM'
export const ROOMS_SUBSCRIBED = 'rooms/ROOMS_SUBSCRIBED'
export const ROOMS_UNSUBSCRIBED = 'rooms/ROOMS_UNSUBSCRIBED'
export const UPDATE_ROOM_STATE = 'rooms/UPDATE_ROOM_STATE'
export const ROOM = 'rooms/ROOM'
export const ROOM_RECEIVED = 'rooms/ROOM_RECEIVED'
export const ROOM_FAILED = 'rooms/ROOM_FAILED'
export const JOIN_ROOM = 'rooms/JOIN_ROOM'
export const JOIN_ROOM_OK = 'rooms/JOIN_ROOM_OK'
export const JOIN_ROOM_FAILED = 'rooms/JOIN_ROOM_FAILED'
export const LEAVE_ROOM = 'rooms/LEAVE_ROOM'
export const LEAVE_ROOM_OK = 'rooms/LEAVE_ROOM_OK'
export const LEAVE_ROOM_FAILED = 'rooms/LEAVE_ROOM_FAILED'
export const MARK_ALL_AS_READ = 'rooms/MARK_ALL_AS_READ'
export const MARK_ALL_AS_READ_OK = 'rooms/MARK_ALL_AS_READ_OK'
export const MARK_ALL_AS_READ_FAILED = 'rooms/MARK_ALL_AS_READ_FAILED'

/**
 * Action Creators
 */

/**
 * Returns current user rooms by token
 */
export function getRooms() {
  return async (dispatch, getState) => {
    const {token} = getState().auth
    dispatch({type: CURRENT_USER_ROOMS})
    try {
      const payload = await Api.currentUserRooms(token)
      dispatch({type: CURRENT_USER_ROOMS_RECEIVED, payload})
    } catch (error) {
      dispatch({type: CURRENT_USER_ROOMS_FAILED, error})
    }
  }
}

/**
 * Return room by id
 */

export function getRoom(id) {
  return async (dispatch, getState) => {
    const {token} = getState().auth
    dispatch({type: ROOM})
    try {
      const payload = await Api.room(token, id)
      dispatch({type: ROOM_RECEIVED, payload})
    } catch (error) {
      dispatch({type: ROOM_FAILED, error})
    }
  }
}

/**
 * Returns suggested rooms by user id
 */
export function getSuggestedRooms() {
  return async (dispatch, getState) => {
    const {token} = getState().auth
    const {id} = getState().viewer.user

    dispatch({type: SUGGESTED_ROOMS})

    try {
      const payload = await Api.currentUserSuggested(token, id)
      dispatch({type: SUGGESTED_ROOMS_RECEIVED, payload})
    } catch (error) {
      dispatch({type: SUGGESTED_ROOMS_FAILED, error})
    }
  }
}

/**
 * Set active room
 */
export function selectRoom(roomId) {
  return {type: SELECT_ROOM, payload: roomId}
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
 * Update unread count by faye action
 */

export function updateRoomState(json) {
  return dispatch => {
    dispatch({type: UPDATE_ROOM_STATE, payload: json})
  }
}

/**
 * Join room
 */

export function joinRoom(roomId) {
  return async (dispatch, getState) => {
    const {token} = getState().auth
    const room = getState().rooms.rooms[roomId]

    dispatch({type: JOIN_ROOM, roomId})

    try {
      const payload = await Api.joinRoom(token, room.uri)
      dispatch({type: JOIN_ROOM_OK, payload})
    } catch (error) {
      dispatch({type: JOIN_ROOM_FAILED, error})
    }
  }
}

/**
 * Leave room
 */

export function leaveRoom(roomId, userId) {
  return async (dispatch, getState) => {
    const {token} = getState().auth
    const newUserId = userId || getState().viewer.user.id

    dispatch({type: LEAVE_ROOM, roomId})

    try {
      const payload = await Api.leaveRoom(token, roomId, newUserId)

      if (!!payload.success && payload.success === true) {
        dispatch({type: LEAVE_ROOM_OK, roomId, userId})
      } else {
        dispatch({type: LEAVE_ROOM_FAILED, error: `User ${newUserId} can't leave room ${roomId}`})
      }
    } catch (error) {
      dispatch({type: LEAVE_ROOM_FAILED, error})
    }
  }
}

/**
 * Mark all messages in room as readed
 */

export function markAllAsRead(roomId) {
  return async (dispatch, getState) => {
    const {token} = getState().auth
    const {id} = getState().viewer.user

    dispatch({type: MARK_ALL_AS_READ, roomId})

    try {
      const payload = await Api.markAllAsRead(token, roomId, id)

      if (!!payload.success && payload.success === true) {
        dispatch({type: MARK_ALL_AS_READ_OK, roomId})
      } else {
        dispatch({type: MARK_ALL_AS_READ_FAILED, error: `Can't mark all room ${roomId} messages as read`})
      }
    } catch (error) {
      dispatch({type: MARK_ALL_AS_READ_FAILED, error})
    }
  }
}

/**
 * Reducer
 */

const initialState = {
  isLoading: false,
  ids: [],
  rooms: {},
  suggestedRooms: [],
  activeRoom: '',
  error: false,
  errors: {}
}

export default function rooms(state = initialState, action) {
  switch (action.type) {
  case ROOM:
  case SUGGESTED_ROOMS:
  case CURRENT_USER_ROOMS: {
    return {...state,
      isLoading: true
    }
  }

  case CURRENT_USER_ROOMS_RECEIVED: {
    const normalized = normalize(action.payload)
    return {...state,
      isLoading: false,
      ids: state.ids.concat(normalized.ids),
      rooms: _.merge({}, state.rooms, normalized.entities)
    }
  }

  case ROOM_RECEIVED: {
    const {id} = action.payload
    return {...state,
      isLoading: false,
      ids: state.ids.concat(id),
      rooms: {...state.rooms,
        [id]: action.payload
      }
    }
  }

  case SUGGESTED_ROOMS_RECEIVED: {
    return {...state,
      isLoading: false,
      suggestedRooms: action.payload
    }
  }

  case SELECT_ROOM: {
    return {...state,
      activeRoom: action.payload
    }
  }

  case UPDATE_ROOM_STATE: {
    const {id} = action.payload.model
    const room = state.rooms[id]
    return {...state,
      rooms: {...state.rooms,
        [id]: _.merge(room, action.payload.model)
      }
    }
  }

  case JOIN_ROOM_OK: {
    const {id} = action.payload
    const room = state.rooms[id]
    return {...state,
      rooms: {...state.rooms,
        [id]: _.merge(room, action.payload)
      }
    }
  }

  case LEAVE_ROOM_OK: {
    const {roomId} = action
    const room = state.rooms[roomId]
    const newRoom = _.merge({}, room, {roomMember: false})
    return {...state,
      rooms: {...state.rooms,
        [roomId]: newRoom
      }
    }
  }

  case MARK_ALL_AS_READ_OK: {
    const {roomId} = action
    const room = state.rooms[roomId]
    const newRoom = _.merge({}, room, {unreadItems: 0, mentions: 0})
    return {...state,
      rooms: {...state.rooms,
        [roomId]: newRoom
      }
    }
  }

  case LOGOUT: {
    return initialState
  }

  case MARK_ALL_AS_READ_FAILED:
  case LEAVE_ROOM_FAILED:
  case JOIN_ROOM_FAILED:
  case ROOM_FAILED:
  case SUGGESTED_ROOMS_FAILED:
  case CURRENT_USER_ROOMS_FAILED: {
    return {...state,
      isLoading: false,
      error: true,
      errors: action.error
    }
  }
  default:
    return state
  }
}
