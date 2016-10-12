export const READ_BY_SNAPSHOT = 'readBy/READ_BY_SNAPSHOT'

export function receiveReadBySnapshot(messageId, snapshot) {
  return {
    type: READ_BY_SNAPSHOT,
    payload: snapshot,
    messageId
  }
}

const initialState = {
  byMessage: {}
}

export default function readBy(state = initialState, action) {
  switch (action.type) {
  case READ_BY_SNAPSHOT:
    return {...state,
      byMessage: {...state.byMessage,
        [action.messageId]: action.payload
      }
    }

  default:
    return state
  }
}
