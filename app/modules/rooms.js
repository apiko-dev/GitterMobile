import * as Api from '../api/gitter'
import _ from 'lodash'
import {ToastAndroid} from 'react-native'
import normalize from '../utils/normalize'
import {LOGOUT} from './auth'
import * as Navigation from './navigation'
import {subscribeToChatMessages, unsubscribeToChatMessages, checkFayeConnection} from './realtime'


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
export const UPDATE_ROOM_STATE = 'rooms/UPDATE_ROOM_STATE'
export const ROOM = 'rooms/ROOM'
export const ROOM_RECEIVED = 'rooms/ROOM_RECEIVED'
export const ROOM_FAILED = 'rooms/ROOM_FAILED'
export const JOIN_ROOM = 'rooms/JOIN_ROOM'
export const JOIN_ROOM_OK = 'rooms/JOIN_ROOM_OK'
export const JOIN_ROOM_FAILED = 'rooms/JOIN_ROOM_FAILED'
export const JOIN_USER_ROOM = 'rooms/JOIN_USER_ROOM'
export const JOIN_USER_ROOM_OK = 'rooms/JOIN_USER_ROOM_OK'
export const JOIN_USER_ROOM_FAILED = 'rooms/JOIN_USER_ROOM_FAILED'
export const LEAVE_ROOM = 'rooms/LEAVE_ROOM'
export const LEAVE_ROOM_OK = 'rooms/LEAVE_ROOM_OK'
export const LEAVE_ROOM_FAILED = 'rooms/LEAVE_ROOM_FAILED'
export const MARK_ALL_AS_READ = 'rooms/MARK_ALL_AS_READ'
export const MARK_ALL_AS_READ_OK = 'rooms/MARK_ALL_AS_READ_OK'
export const MARK_ALL_AS_READ_FAILED = 'rooms/MARK_ALL_AS_READ_FAILED'
export const CHANGE_FAVORITE_STATUS_OK = 'rooms/CHANGE_FAVORITE_STATUS_OK'
export const CHANGE_FAVORITE_STATUS_FAILED = 'rooms/CHANGE_FAVORITE_STATUS_FAILED'
export const ADD_USER_TO_ROOM = 'rooms/ADD_USER_TO_ROOM'
export const ADD_USER_TO_ROOM_OK = 'rooms/ADD_USER_TO_ROOM_OK'
export const ADD_USER_TO_ROOM_ERROR = 'rooms/ADD_USER_TO_ROOM_ERROR'
export const HIDE_ROOM = 'rooms/HIDE_ROOM'
export const RECEIVE_ROOMS_SNAPSHOT = 'rooms/RECEIVE_ROOMS_SNAPSHOT'
export const GET_NOTIFICATION_SETTINGS = 'rooms/GET_NOTIFICATION_SETTINGS'
export const GET_NOTIFICATION_SETTINGS_OK = 'rooms/GET_NOTIFICATION_SETTINGS_OK'
export const GET_NOTIFICATION_SETTINGS_ERROR = 'rooms/GET_NOTIFICATION_SETTINGS_ERROR'
export const CHANGE_NOTIFICATION_SETTINGS_OK = 'rooms/CHANGE_NOTIFICATION_SETTINGS_OK'
export const CHANGE_NOTIFICATION_SETTINGS_ERROR = 'rooms/CHANGE_NOTIFICATION_SETTINGS_ERROR'

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

export function receiveRoomsSnapshot(payload) {
  return {
    type: RECEIVE_ROOMS_SNAPSHOT,
    payload
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
  return (dispatch, getState) => {
    const {activeRoom} = getState().rooms

    dispatch({type: SELECT_ROOM, payload: roomId})
    if (roomId === '') {
      return
    }

    if (!!activeRoom) {
      dispatch(unsubscribeToChatMessages(activeRoom))
    }
    dispatch(subscribeToChatMessages(roomId))
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
    const {id} = getState().viewer.user

    dispatch({type: JOIN_ROOM, roomId})

    try {
      const payload = await Api.joinRoom(token, id, roomId)
      dispatch({type: JOIN_ROOM_OK, payload})
    } catch (error) {
      dispatch({type: JOIN_ROOM_FAILED, error})
    }
  }
}

export function joinUserRoom(username) {
  return async (dispatch, getState) => {
    const {token} = getState().auth

    dispatch({type: JOIN_USER_ROOM, username})

    try {
      const payload = await Api.joinRoomByUserName(token, username)

      dispatch({type: JOIN_USER_ROOM_OK, payload})
    } catch (error) {
      dispatch({type: JOIN_USER_ROOM_FAILED, error})
    }
  }
}

/**
 * Leave room
 */

export function leaveRoom(roomId, userId) {
  return async (dispatch, getState) => {
    const {token} = getState().auth
    const room = getState().rooms.rooms[roomId]
    const newUserId = userId || getState().viewer.user.id
    dispatch({type: LEAVE_ROOM, roomId})

    try {
      if (room.githubType === 'ONETOONE') {
        await Api.hideRoom(token, roomId, newUserId)
        dispatch({type: HIDE_ROOM, roomId})
        dispatch(Navigation.resetTo({name: 'home'}))
      } else {
        const payload = await Api.leaveRoom(token, roomId, newUserId)

        if (!!payload.success && payload.success === true) {
          dispatch({type: LEAVE_ROOM_OK, roomId, userId})
        } else {
          dispatch({type: LEAVE_ROOM_FAILED, error: `User ${newUserId} cant leave room ${roomId}`})
        }
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
        dispatch({type: MARK_ALL_AS_READ_FAILED, error: `Cant mark all room ${roomId} messages as read`})
      }
    } catch (error) {
      dispatch({type: MARK_ALL_AS_READ_FAILED, error})
    }
  }
}

/**
 * Favorite/unfavorite room
 */

export function changeFavoriteStatus(roomId) {
  return async (dispatch, getState) => {
    const {token} = getState().auth
    const {id} = getState().viewer.user
    const room = getState().rooms.rooms[roomId]
    const status = room.hasOwnProperty('favourite') ? false : true
    try {
      await Api.changeFavoriteStatus(token, id, roomId, status)
      dispatch({type: CHANGE_FAVORITE_STATUS_OK, roomId, status})
    } catch (error) {
      dispatch({type: CHANGE_FAVORITE_STATUS_FAILED, roomId, error: error.message})
    }
  }
}

export function addUserToRoom(roomId, username) {
  return async (dispatch, getState) => {
    const {token} = getState().auth

    dispatch({type: ADD_USER_TO_ROOM, roomId, username})
    try {
      const payload = await Api.addUserToRoom(token, roomId, username)
      if (!!payload.success && payload.success === true) {
        dispatch({type: ADD_USER_TO_ROOM_OK, payload})
        ToastAndroid.show(`User ${username} was added.`, ToastAndroid.SHORT)
      } else {
        dispatch({type: ADD_USER_TO_ROOM_ERROR, error: payload})
        ToastAndroid.show(`User ${username} wasnt added.`, ToastAndroid.SHORT)
      }
    } catch (error) {
      dispatch({type: ADD_USER_TO_ROOM_ERROR, error})
    }
  }
}

export function getNotificationSettings(roomId) {
  return async (dispatch, getState) => {
    const {token} = getState().auth
    const {id} = getState().viewer.user

    dispatch({type: GET_NOTIFICATION_SETTINGS, roomId})

    try {
      const payload = await Api.getNotificationSettings(token, id, roomId)
      dispatch({type: GET_NOTIFICATION_SETTINGS_OK, roomId, payload})
    } catch (error) {
      dispatch({type: GET_NOTIFICATION_SETTINGS_ERROR, error: error.message})
    }
  }
}

export function changeNotificationSettings(roomId, index) {
  return async (dispatch, getState) => {
    const {token} = getState().auth
    const {id} = getState().viewer.user
    const modes = ['all', 'announcement', 'mute']

    try {
      const payload = await Api.changeNotificationSettings(token, id, roomId, modes[index])
      dispatch({type: CHANGE_NOTIFICATION_SETTINGS_OK, roomId, payload})
    } catch (error) {
      dispatch({type: CHANGE_NOTIFICATION_SETTINGS_ERROR, error: error.message})
    }
  }
}

export function refreshRooms() {
  return async (dispatch, getState) => {
    dispatch(getRooms())
    await checkFayeConnection()
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
  errors: {},
  notifications: {}
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

  case RECEIVE_ROOMS_SNAPSHOT:
  case CURRENT_USER_ROOMS_RECEIVED: {
    const sorted = action.payload
      .filter(item => item.hasOwnProperty('lastAccessTime') && item.lastAccessTime !== null)
      .sort((item1, item2) => Date.parse(item2.lastAccessTime) - Date.parse(item1.lastAccessTime))
    const {ids, entities} = normalize(sorted)
    return {...state,
      isLoading: false,
      ids,
      rooms: entities
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
        [id]: _.merge({}, room, action.payload.model)
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

  case JOIN_USER_ROOM_OK: {
    const {payload} = action
    return {...state,
      ids: state.ids.concat(payload.id),
      rooms: {...state.rooms,
        [payload.id]: action.payload
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

  case CHANGE_FAVORITE_STATUS_OK: {
    const {roomId, status} = action
    const newRoom = Object.assign({}, state.rooms[roomId])

    if (status) {
      newRoom.favourite = true
    } else {
      newRoom.hasOwnProperty('favourite') && delete newRoom.favourite
    }
    return {...state,
      rooms: {...state.rooms,
        [roomId]: newRoom
      }
    }
  }

  case LOGOUT: {
    return initialState
  }

  case CHANGE_NOTIFICATION_SETTINGS_OK:
  case GET_NOTIFICATION_SETTINGS_OK:
    return {...state,
      notifications: {...state.notifications,
        [action.roomId]: action.payload
      }
    }

  case CHANGE_NOTIFICATION_SETTINGS_ERROR:
  case GET_NOTIFICATION_SETTINGS_ERROR:
  case JOIN_USER_ROOM_FAILED:
  case CHANGE_FAVORITE_STATUS_FAILED:
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
