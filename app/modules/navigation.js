import {nav} from '../screens'

const NAVIGATE_TO = 'navigation/NAVIGATE_TO'
const NAVIGATE_BACK = 'navigation/NAVIGATE_BACK'
const NAVIGATE_REPLACE = 'navigation/NAVIGATE_REPLACE'
const NAVIGATE_RESET = 'navigation/NAVIGATE_RESET'
const UPDATE_HISTORY = 'navigation/UPDATE_HISTORY'

export function goTo(route) {
  return dispatch => {
    dispatch({type: NAVIGATE_TO, route})
    nav.push(route)
    dispatch({type: UPDATE_HISTORY})
  }
}

export function goBack() {
  return dispatch => {
    nav.pop()
    dispatch({type: NAVIGATE_BACK})
  }
}

export function goAndReplace(route) {
  return dispatch => {
    dispatch({type: NAVIGATE_REPLACE, route})
    nav.replace(route)
    dispatch({type: UPDATE_HISTORY})
  }
}

export function resetTo(route) {
  return dispatch => {
    dispatch({type: NAVIGATE_RESET, route})
    nav.resetTo(route)
    dispatch({type: UPDATE_HISTORY})
  }
}

const initialState = {
  init: {name: 'launch'},
  current: {},
  prevision: {},
  history: []
}

export default function navigation(state = initialState, action) {
  switch (action.type) {
  case NAVIGATE_TO:
    return {...state,
      current: action.route,
      prevision: state.current,
      history: nav.getCurrentRoutes()
    }

  case NAVIGATE_BACK: {
    const {history} = state
    return {...state,
      current: state.prevision,
      prevision: history.length >= 2 ? history[history.length - 2] : {},
      history: nav.getCurrentRoutes()
    }
  }

  case NAVIGATE_RESET:
    return {...state,
      current: action.route,
      prevision: {},
      history: nav.getCurrentRoutes()
    }

  case NAVIGATE_REPLACE:
    return {...state,
      current: action.route,
      history: nav.getCurrentRoutes()
    }

  case UPDATE_HISTORY:
    return {...state,
      history: nav.getCurrentRoutes()
    }
  default:
    return state
  }
}
