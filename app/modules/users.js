import * as Api from '../api/gitter'

/**
 * Constants
 */

export const USER = 'users/USER'
export const USER_OK = 'users/USER_OK'
export const USER_FAILED = 'users/USER_FAILED'

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
