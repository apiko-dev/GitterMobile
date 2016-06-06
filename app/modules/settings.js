export const READ_ALL_MESSAGES = 'settings/READ_ALL_MESSAGES'

export function readAll(enabled, limit = 2) {
  return {
    type: READ_ALL_MESSAGES,
    enabled,
    limit
  }
}

const initialState = {
  limit: 30,
  usersLimit: 30,
  readAllMessages: {
    enabled: false,
    limit: 2
  }
}

export default function settings(state = initialState, action) {
  switch (action.type) {
  case READ_ALL_MESSAGES:
    return {...state,
      readAllMessages: {
        enabled: action.enabled,
        limit: action.limit
      }
    }

  default:
    return state
  }
}
