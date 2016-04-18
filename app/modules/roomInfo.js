import * as Api from '../api/gitter'
import {subscribeToRoomEvents} from './realtime'

export const REPO_INFO = 'roomInfo/REPO_INFO'
export const REPO_INFO_OK = 'roomInfo/REPO_INFO_OK'
export const REPO_INFO_ERROR = 'roomInfo/REPO_INFO_ERROR'
export const ROOM_INFO = 'roomInfo/ROOM_INFO'
export const CLEAR_ERROR = 'roomInfo/CLEAR_ERROR'

export function getRoomInfo(repoName, roomId) {
  return async (dispatch, getState) => {
    const {token} = getState().auth
    const room = getState().rooms.rooms[roomId]

    if (room.githubType !== 'ONETOONE') {
      dispatch(subscribeToRoomEvents(roomId))
    }

    if (room.githubType !== 'REPO') {
      dispatch({type: ROOM_INFO, payload: room})
    } else {
      dispatch({type: REPO_INFO, repoName})

      try {
        const res = await Api.getRepoInfo(token, repoName)
        const resText = await res.text()

        if (resText.length > 0) {
          const payload = JSON.parse(resText)
          dispatch({type: REPO_INFO_OK, payload, repoName})
        }
      } catch (error) {
        dispatch({type: REPO_INFO_ERROR, error})
      }
    }
  }
}

export function clearRoomInfoError() {
  return {
    type: CLEAR_ERROR
  }
}

const initialState = {
  isFetching: false,
  ids: [],
  entities: {},
  isError: false,
  error: {}
}

export default function roomInfo(state = initialState, action) {
  switch (action.type) {
  case REPO_INFO:
    return {...state,
      isFetching: true
    }

  case REPO_INFO_OK: {
    const {payload, repoName} = action
    return {...state,
      isFetching: false,
      ids: state.ids.concat(repoName),
      entities: {...state.entities,
        [repoName]: payload
      }
    }
  }

  case ROOM_INFO:
    return {...state,
      isFetching: false,
      ids: state.ids.concat(action.payload.name),
      entities: {...state.entities,
        [action.payload.name]: action.payload
      }
    }

  case CLEAR_ERROR:
    return {...state,
      isFetching: false,
      isError: false,
      error: {}
    }

  case REPO_INFO_ERROR:
    return {...state,
      isFetching: false,
      isError: true,
      error: action.error
    }

  default:
    return state
  }
}
