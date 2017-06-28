import * as Api from '../api/gitter'
import {INITIALIZED, init} from './app'
import {removeFayeEvents} from './realtime'
import {rootNavigator} from '../index'
import {setItem, removeItem} from '../utils/storage'

/**
 * Constants
 */

const TOKEN_REGEX = /^[a-z\d]*$/i

export const LOGINING = 'auth/LOGINING'
export const LOGINED_IN_SUCCESS = 'auth/LOGINED_IN_SUCCESS'
export const LOGIN_USER = 'auth/LOGIN_USER'
export const LOGIN_USER_BY_TOKEN = 'auth/LOGIN_USER_BY_TOKEN'
export const UNEXPECTED_ERROR = 'auth/UNEXPECTED_ERROR'
export const LOGOUT = 'auth/LOGOUT'
export const CHECK_TOKEN = 'auth/CHECK_TOKEN'
export const CHECK_TOKEN_OK = 'auth/CHECK_TOKEN_OK'
export const CHECK_TOKEN_ERROR = 'auth/CHECK_TOKEN_ERROR'

/**
 * Action Creators
 */

export function checkToken({token}) {
  return async dispatch => {
    try {
      dispatch({type: CHECK_TOKEN})

      if (!TOKEN_REGEX.test(token)) {
        throw new Error('Bad token.')
      }

      const user = await Api.me(token)

      if (!!user.error) {
        throw new Error('Unable to authenticate. Please try again.')
      }

      dispatch({type: CHECK_TOKEN_OK})

      await dispatch(loginByToken({token}))
    } catch (err) {
      dispatch({type: CHECK_TOKEN_ERROR, error: err.message})
    }
  }
}

export function loginByToken({token, code}) {
  return async dispatch => {
    try {
      dispatch({type: LOGINING})

      let authToken = token

      if (code) {
        const res = await Api.getToken(code)
        authToken = res.access_token
      }

      await setItem('token', authToken)
      dispatch({type: LOGIN_USER_BY_TOKEN, token: authToken})

      rootNavigator.startAppWithScreen({screen: 'gm.Launch'})
      await dispatch(init())

      dispatch({type: LOGINED_IN_SUCCESS})
    } catch (err) {
      dispatch({type: UNEXPECTED_ERROR, error: err.message})
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
  errors: ''
}

export default function auth(state = initialState, action) {
  switch (action.type) {
  case INITIALIZED: {
    if (!!action.token) {
      return {...state,
        loginedIn: true,
        token: action.token,
        error: false
      }
    } else {
      return {...state,
        error: true,
        errors: action.error
      }
    }
  }

  case CHECK_TOKEN:
  case LOGINING: {
    return {...state,
      logining: true,
      error: false,
      errors: ''
    }
  }


  case CHECK_TOKEN_OK:
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

  case CHECK_TOKEN_ERROR:
  case UNEXPECTED_ERROR:
    return {...state,
      error: true,
      logining: false,
      errors: action.error
    }

  case LOGOUT: {
    return initialState
  }
  default:
    return state
  }
}
