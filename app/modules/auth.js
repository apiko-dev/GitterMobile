import {INITIALIZED} from './init'

/**
 * Constants
 */

export const LOGIN_USER = 'auth/LOGIN_USER'

/**
 * Action Creators
 */



/**
 * Reducer
 */

const initialState = {
  loginedIn: false,
  token: '',
  error: false,
  errors: {}
}

export default function auth(state = initialState, action) {
  switch (action.type) {
    case INITIALIZED:
    {
      if (!!action.token) {
        return {...state,
          loginedIn: true,
          token: action.token
        }
      } else {
        return {...state,
          error: true,
          errors: action.error
        }
      }
    }
    default:
      return state
  }
}
