import {NavigationStateUtils} from 'react-native'

const NAVIGATE_TO = 'navigation/NAVIGATE_TO'
const NAVIGATE_BACK = 'navigation/NAVIGATE_BACK'
const NAVIGATE_REPLACE = 'navigation/NAVIGATE_REPLACE'
const NAVIGATE_RESET = 'navigation/NAVIGATE_RESET'

export function goTo(state) {
  return {
    type: NAVIGATE_TO,
    state
  }
}

export function goBack() {
  return {
    type: NAVIGATE_BACK
  }
}

export function goAndReplace(key, state) {
  return {
    type: NAVIGATE_REPLACE,
    key,
    state
  }
}

export function resetTo(state) {
  return {
    type: NAVIGATE_RESET,
    state
  }
}

const initialState = {
  key: 'Root',
  index: 0,
  children: [
		{ key: 'home' }
  ]
}

export default function navigation(state = initialState, action) {
  switch (action.type) {
  case NAVIGATE_TO:
    return NavigationStateUtils.push(state, action.state)

  case NAVIGATE_BACK:
    if (state.index === 0 || state.children.length === 1) {
      return state
    }
    return NavigationStateUtils.pop(state)

  case NAVIGATE_RESET:
    return NavigationStateUtils.reset(state, action.state)

  case NAVIGATE_REPLACE:
    return NavigationStateUtils.replaceAt(state, action.key, action.state)

  default:
    return state
  }
}
