import * as Api from '../api/gitter'
import {getRooms, getSuggestedRooms} from './rooms'

/**
 * Constants
 */

export const CURRENT_USER = 'viewer/CURRENT_USER'
export const CURRENT_USER_RECEIVED = 'viewer/CURRENT_USER_RECEIVED'
export const CURRENT_USER_FAILED = 'viewer/CURRENT_USER_FAILED'

/**
 * Action creators
 */

/**
 * Returns current user info by token
 */
export function getCurrentUser() {
  return async (dispatch, getState) => {
    const {token} = getState().auth
    try {
      dispatch({type: CURRENT_USER})
      const payload = await Api.currentUser(token)
      dispatch({type: CURRENT_USER_RECEIVED, payload: payload[0]})
      dispatch(getRooms())
      dispatch(getSuggestedRooms())
    } catch (error) {
      dispatch({CURRENT_USER_FAILED, error})
    }
  }
}

/**
 * Reducer
 */

const initalState = {
  isLoading: false,
  error: false,
  errors: [],
  user: {}
}

export default function viewer(state = initalState, action) {
  switch (action.type) {
  case CURRENT_USER: {
    return {...state,
      isLoading: true
    }
  }

  case CURRENT_USER_RECEIVED: {
    return {...state,
      isLoading: false,
      user: action.payload
    }
  }

  case CURRENT_USER_FAILED: {
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
