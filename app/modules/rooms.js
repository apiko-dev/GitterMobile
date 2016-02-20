import * as Api from '../api/gitter'
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
      ids: normalized.ids,
      rooms: normalized.entities
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

  case LOGOUT: {
    return Object.assign({}, initialState)
  }

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
