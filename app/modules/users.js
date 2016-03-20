import * as Api from '../api/gitter'
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

export function chatPrivately(userId) {
  return async (dispatch, getState) => {
    dispatch({type: CHAT_PRIVATELY, userId})
    const room = _.find(getState().rooms.rooms, {user: {id: userId}})

    try {
      if (typeof room !== 'undefined') {
        dispatch(Navigation.resetWithStack([{name: 'home'}, {name: 'room', roomId: room.id}]))
      } else {
        const {username} = getState().users.entities[userId]
        await dispatch(joinUserRoom(username))
        const newRoom = _.find(getState().rooms.rooms, {user: {id: userId}})
        dispatch(Navigation.resetWithStack([{name: 'home'}, {name: 'room', roomId: newRoom.id}]))
      }
      dispatch({type: CHAT_PRIVATELY_OK, userId})
    } catch (error) {
      dispatch({type: CHAT_PRIVATELY_FAILED, error})
    }
  }
}


/**
 * Reducer
 */

const initialState = {
  isLoadingUser: false,
  ids: [],
  entities: {},
  error: false,
  errors: {}
}

export default function users(state = initialState, action) {
  switch (action.type) {
  case USER:
    return {...state,
      isLoadingUser: true
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

  case USER_FAILED:
    return {...state,
      isLoadingUser: false,
      error: true,
      errors: action.error
    }
  default:
    return state
  }
}
