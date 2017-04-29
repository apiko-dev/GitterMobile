import {INITIALIZED, init} from './app'
import {removeFayeEvents} from './realtime'
import {rootNavigator} from '../index'
import {setItem, removeItem} from '../utils/storage'

/**
 * Constants
 */

export const LOGINING = 'auth/LOGINING'
export const LOGINED_IN_SUCCESS = 'auth/LOGINED_IN_SUCCESS'
export const LOGIN_USER = 'auth/LOGIN_USER'
export const LOGIN_USER_BY_TOKEN = 'auth/LOGIN_USER_BY_TOKEN'
export const UNEXPECTED_ERROR = 'auth/UNEXPECTED_ERROR'
export const LOGOUT = 'auth/LOGOUT'

/**
 * Action Creators
 */

export function loginByToken(token) {
  return async dispatch => {
    try {
      dispatch({type: LOGINING})

      await setItem('token', token)
      dispatch({type: LOGIN_USER_BY_TOKEN, token})

      rootNavigator.startAppWithScreen({screen: 'gm.Launch'})
      await dispatch(init())

      dispatch({LOGINED_IN_SUCCESS})
    } catch (err) {
      dispatch({type: UNEXPECTED_ERROR, error: err})
    }
  }
}

export function logOut() {
  return async dispatch => {
    try {
      await removeItem('token')
      dispatch({type: LOGOUT})
      // dispatch(removeFayeEvents())
      rootNavigator.startAppWithScreen({screen: 'gm.Login'})
    } catch (error) {
      console.warn("Can't logout. Error: ", error.message) // eslint-disable-line no-console
    }
  }
}

/**
 * Reducer
 */

const initialState = {
  logining: false,
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
  case LOGINING: {
    return {...state,
      logining: true
    }
  }

  case LOGINED_IN_SUCCESS: {
    return {...state,
      logining: false
    }
  }

  case LOGIN_USER_BY_TOKEN: {
    return {...state,
      loginedIn: true,
      token: action.token
    }
  }

  case LOGOUT: {
    return initialState
  }
  default:
    return state
  }
}
