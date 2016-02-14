import {INITIALIZED} from './init'
import {setItem} from '../utils/storage'

/**
 * Constants
 */

export const LOGIN_USER = 'auth/LOGIN_USER'
export const LOGIN_USER_BY_TOKEN = 'auth/LOGIN_USER_BY_TOKEN'
export const UNEXPECTED_ERROR = 'auth/UNEXPECTED_ERROR'

/**
 * Action Creators
 */

export function loginByToken(token) {
  return async dispatch => {
    try {
      const result = await setItem('token', token)
      dispatch({type: LOGIN_USER_BY_TOKEN, token})
    } catch (err) {
      dispatch({type: UNEXPECTED_ERROR, error: err})
    }
  }
}

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
  case INITIALIZED: {
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
  case LOGIN_USER_BY_TOKEN: {
    return {...state,
      loginedIn: true,
      token: action.token
    }
  }
  default:
    return state
  }
}
