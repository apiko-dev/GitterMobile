import * as Api from '../api/gitter'
import normalize from '../utils/normalize'
import _ from 'lodash'

/**
 * Constants
 */

export const ROOM_MESSAGES = 'messages/ROOM_MESSAGES'
export const ROOM_MESSAGES_RECEIVED = 'messages/ROOM_MESSAGES_RECEIVED'
export const ROOM_MESSAGES_FAILED = 'messages/ROOM_MESSAGES_FAILED'
export const PREPARE_LIST_VIEW = 'messages/PREPARE_LIST_VIEW'

/**
 * Action creators
 */

export function getRoomMessages(roomId) {
  return async (dispatch, getState) => {
    const {token} = getState().auth
    dispatch({type: ROOM_MESSAGES, payload: roomId})
    try {
      const payload = await Api.roomMessages(token, roomId)
      dispatch({type: ROOM_MESSAGES_RECEIVED, roomId, payload})
    } catch (error) {
      dispatch({type: ROOM_MESSAGES_FAILED, error})
    }
  }
}

export function prepareListView(ds) {
  return {
    type: PREPARE_LIST_VIEW, payload: ds
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
    const {payload, roomId} = action
    const {ids, entities} = normalize(payload)
    const rowIds = []
    const data = ids.map((id, index) => {
      rowIds.push(index)
      return entities[id]
    })
    return {...state,
      isLoading: false,
      byRoom: {...state.byRoom, [roomId]: [...ids]},
      entities: _.merge({}, state.entities, entities),
      listView: {
        dataSource: state.listView.dataSource.cloneWithRows(data, rowIds),
        data,
        rowIds
      }
    }
  }

  case PREPARE_LIST_VIEW:
    return {...state,
      listView: {
        dataSource: action.payload,
        data: [],
        rowIds: []
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
