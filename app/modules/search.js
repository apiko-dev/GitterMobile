import * as Api from '../api/gitter'

/**
 * Constants
 */

export const SET_INPUT_VALUE = 'search/SET_INPUT_VALUE'
export const SEARCH_USERS = 'search/SEARCH_USERS'
export const SEARCH_USERS_OK = 'search/SEARCH_USERS_OK'
export const SEARCH_USERS_FAILED = 'search/SEARCH_USERS_FAILED'
export const SEARCH_ROOMS = 'search/SEARCH_ROOMS'
export const SEARCH_ROOMS_OK = 'search/SEARCH_ROOMS_OK'
export const SEARCH_ROOMS_FAILED = 'search/SEARCH_ROOMS_FAILED'
export const CLEAR_SEARCH = 'search/CLEAR_SEARCH'
export const SEARCH_ROOM_USERS = 'search/SEARCH_ROOM_USERS'
export const SEARCH_ROOM_USERS_OK = 'search/SEARCH_ROOM_USERS_OK'
export const SEARCH_ROOM_USERS_FAILED = 'search/SEARCH_ROOM_USERS_FAILED'

/**
 *  Actions
 */

export function setInputValue(text) {
  return {
    type: SET_INPUT_VALUE,
    payload: text
  }
}

export function clearSearch() {
  return {
    type: CLEAR_SEARCH
  }
}

export function searchUsers(query) {
  return async (dispatch, getState) => {
    const {token} = getState().auth
    dispatch({type: SEARCH_USERS})

    try {
      const response = await Api.searchUsers(token, query)
      dispatch({type: SEARCH_USERS_OK, payload: response.results})
    } catch (error) {
      dispatch({type: SEARCH_USERS_FAILED, error})
    }
  }
}

export function searchRooms(query) {
  return async (dispatch, getState) => {
    const {token} = getState().auth
    const {id} = getState().viewer.user
    dispatch({type: SEARCH_ROOMS})

    try {
      const [rooms, userRooms] = await Promise.all([
        Api.searchRooms(token, query),
        Api.searchUserRooms(token, id, query)
      ])

      const payload = userRooms.results.concat(rooms.results)
      dispatch({type: SEARCH_ROOMS_OK, payload})
    } catch (error) {
      dispatch({type: SEARCH_ROOMS_FAILED, error})
    }
  }
}

export function searchRoomUsers(roomId, query) {
  return async (dispatch, getState) => {
    const {token} = getState().auth
    dispatch({type: SEARCH_ROOM_USERS, roomId, query})

    try {
      const payload = await Api.searchRoomUsers(token, roomId, query)
      dispatch({type: SEARCH_ROOM_USERS_OK, payload})
    } catch (error) {
      dispatch({type: SEARCH_ROOM_USERS_FAILED, error})
    }
  }
}

/**
 * Reducer
 */

const initialState = {
  isLoadingUsers: false,
  isLoadingRooms: false,
  isLoadingRoomUser: false,
  inputValue: '',
  usersResult: [],
  roomsResult: [],
  roomUsersResult: [],
  error: false,
  errors: {}
}

export default function search(state = initialState, action) {
  switch (action.type) {
  case SET_INPUT_VALUE:
    return {...state,
      inputValue: action.payload
    }

  case CLEAR_SEARCH:
    return initialState

  case SEARCH_USERS:
    return {...state,
      isLoadingUsers: true
    }

  case SEARCH_ROOMS:
    return {...state,
      isLoadingRooms: true
    }

  case SEARCH_ROOM_USERS:
    return {...state,
      isLoadingRoomUser: true
    }

  case SEARCH_USERS_OK:
    return {...state,
      isLoadingUsers: false,
      usersResult: action.payload
    }

  case SEARCH_ROOMS_OK:
    return {...state,
      isLoadingRooms: false,
      roomsResult: action.payload
    }

  case SEARCH_ROOM_USERS_OK:
    return {...state,
      isLoadingRoomUser: false,
      roomUsersResult: action.payload
    }

  case SEARCH_ROOM_USERS_FAILED:
  case SEARCH_USERS_FAILED:
  case SEARCH_ROOMS_FAILED:
    return {...state,
      error: true,
      errors: action.error
    }
  default:
    return state
  }
}
