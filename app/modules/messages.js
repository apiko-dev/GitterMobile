import * as Api from '../api/gitter'

/**
 * Constants
 */

export const ROOM_MESSAGES = 'messages/ROOM_MESSAGES'
export const ROOM_MESSAGES_RECEIVED = 'messages/ROOM_MESSAGES_RECEIVED'
export const ROOM_MESSAGES_FAILED = 'messages/ROOM_MESSAGES_FAILED'

/**
 * Action creators
 */

export function getRoomMessages(id) {
  return async (dispatch, getState) => {
    const {token} = getState().auth
    dispatch({type: ROOM_MESSAGES, payload: id})
    try {
      const payload = await Api.roomMessages(token, id)
      dispatch({type: ROOM_MESSAGES_RECEIVED, payload})
    } catch (error) {
      dispatch({type: ROOM_MESSAGES_FAILED, error})
    }
  }
}

/**
 * Reducer
 */

const initialState = {
  isLoading: false,
  error: false,
  errors: {},
  byRoom: {
    // [id]: []
  },
  entities: {},
  listView: {
    dataSource: null,
    data: [],
    rowIds: []
  }
}

export default function messages(state = initialState, action) {
  switch (action.type) {
  case ROOM_MESSAGES:
    return {...state,
      isLoading: true
    }

  case ROOM_MESSAGES_RECEIVED: {
    return {...state,
      isLoading: false

    }
  }

  case ROOM_MESSAGES_FAILED:
    return {...state,
      isLoading: false,
      error: true,
      errors: action.error
    }

  default:
    return state
  }
}
