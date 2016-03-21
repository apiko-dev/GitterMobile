import * as NavigationStateUtils from 'react-native/Libraries/NavigationExperimental/NavigationStateUtils'
import randomId from '../utils/randomId'

export const NAVIGATE_TO = 'navigation/NAVIGATE_TO'
export const NAVIGATE_BACK = 'navigation/NAVIGATE_BACK'
export const NAVIGATE_REPLACE_LAST = 'navigation/NAVIGATE_REPLACE_LAST'
export const NAVIGATE_RESET = 'navigation/NAVIGATE_RESET'
export const NAVIGATE_RESET_STACK_WITH = 'navigation/NAVIGATE_RESET_STACK_WITH'

export function goTo(route) {
  return {
    type: NAVIGATE_TO,
    route
  }
}

export function goBack() {
  return {
    type: NAVIGATE_BACK
  }
}

export function replaceLast(route) {
  return {
    type: NAVIGATE_REPLACE_LAST,
    route
  }
}

export function resetTo(route) {
  return {
    type: NAVIGATE_RESET,
    route
  }
}

export function resetStackWith(stack, index) {
  return {
    type: NAVIGATE_RESET_STACK_WITH,
    stack,
    index
  }
}

const initialState = {
  key: 'Root',
  index: 0,
  children: [
		{ key: randomId(), name: 'launch' }
  ]
}

export default function navigation(state = initialState, action) {
  switch (action.type) {
  case NAVIGATE_TO: {
    const route = Object.assign({key: randomId()}, action.route)
    return NavigationStateUtils.push(state, route)
  }

  case NAVIGATE_BACK:
    if (state.index === 0 || state.children.length === 1) {
      return state
    }
    return NavigationStateUtils.pop(state)

  case NAVIGATE_RESET: {
    const route = Object.assign({key: randomId()}, action.route)
    return NavigationStateUtils.reset(state, [route])
  }

  case NAVIGATE_REPLACE_LAST: {
    const route = Object.assign({key: randomId()}, action.route)
    return NavigationStateUtils.replaceAtIndex(state, state.index, route)
  }

  case NAVIGATE_RESET_STACK_WITH: {
    const routes = action.stack.map(route => Object.assign({key: randomId()}, route))
    return NavigationStateUtils.reset(state, routes, action.index)
  }

  default:
    return state
  }
}
