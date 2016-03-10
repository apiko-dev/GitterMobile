import {nav} from '../screens'

const NAVIGATE_TO = 'navigation/NAVIGATE_TO'
const NAVIGATE_BACK = 'navigation/NAVIGATE_BACK'
const NAVIGATE_REPLACE = 'navigation/NAVIGATE_REPLACE'
const NAVIGATE_RESET = 'navigation/NAVIGATE_RESET'

export function goTo(route) {
  return (dispatch, getState) => {
    const {current} = getState().navigation
    nav.push(route)
    dispatch({type: NAVIGATE_TO, prevision: current, current: route})
  }
}

export function goBack() {
  return (dispatch, getState) => {
    const {prevision} = getState().navigation
    nav.pop()
    dispatch({type: NAVIGATE_BACK, route: prevision})
  }
}

export function goAndReplce(route) {
  return dispatch => {
    nav.replace(route)
    dispatch({type: NAVIGATE_REPLACE, route})
  }
}

export function resetTo(route) {
  return dispatch => {
    nav.resetTo(route)
    dispatch({type: NAVIGATE_RESET, route})
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

  case NAVIGATE_BACK:
    return {...state,
      current: action.current,
      prevision: action.prevision,
      history: nav.getCurrentRoutes()
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
  default:
    return state
  }
}
