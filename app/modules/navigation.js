import {nav} from '../screens'

const NAVIGATE_TO = 'navigation/NAVIGATE_TO'
const NAVIGATE_BACK = 'navigation/NAVIGATE_BACK'
const NAVIGATE_REPLACE = 'navigation/NAVIGATE_REPLACE'
const NAVIGATE_RESET = 'navigation/NAVIGATE_RESET'
const NAVIGATE_RESET_WITH_STACK = 'navigation/NAVIGATE_RESET_WITH_STACK'

export function goTo(route) {
  return dispatch => {
    dispatch({type: NAVIGATE_TO, route})
    nav.push(route)
  }
}

export function goBack() {
  return dispatch => {
    dispatch({type: NAVIGATE_BACK})
    nav.pop()
  }
}

export function goAndReplace(route) {
  return dispatch => {
    dispatch({type: NAVIGATE_REPLACE, route})
    nav.replace(route)
  }
}

export function resetTo(route) {
  return dispatch => {
    dispatch({type: NAVIGATE_RESET, route})
    nav.resetTo(route)
  }
}

export function resetWithStack(stack) {
  return dispatch => {
    dispatch({type: NAVIGATE_RESET_WITH_STACK, stack})
    nav.immediatelyResetRouteStack(stack)
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
      history: state.history.concat(action.route)
    }

  case NAVIGATE_BACK: {
    const {history} = state
    const newHistory = [].concat(history)
    newHistory.pop()
    return {...state,
      current: state.prevision,
      prevision: newHistory.length >= 2 ? newHistory[newHistory.length - 2] : {},
      history: newHistory
    }
  }

  case NAVIGATE_RESET:
    return {...state,
      current: action.route,
      prevision: {},
      history: [].concat(action.route)
    }

  case NAVIGATE_REPLACE: {
    const newHistory = [].concat(state.history)
    newHistory[state.history.length - 1] = action.route
    return {...state,
      current: action.route,
      history: newHistory
    }
  }

  case NAVIGATE_RESET_WITH_STACK:
    return {...state,
      current: action.stack[action.stack.length - 1],
      prevision: action.stack.length === 1 ? {} : action.stack[action.stack.length - 2],
      history: action.stack
    }

  default:
    return state
  }
}
