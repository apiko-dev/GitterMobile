import * as Api from '../api/gitter'

export const USER_INFO = 'roomInfo/USER_INFO'
export const USER_INFO_OK = 'roomInfo/USER_INFO_OK'
export const USER_INFO_ERROR = 'roomInfo/USER_INFO_ERROR'
export const CLEAR_ERROR = 'roomInfo/CLEAR_ERROR'

export function getUserInfo(repoName) {
  return async (dispatch, getState) => {
    const {token} = getState().auth
    dispatch({type: USER_INFO})

    try {
      const payload = await Api.getUserInfo(token, repoName)
      dispatch({type: USER_INFO_OK, payload, repoName})
    } catch (error) {
      dispatch({type: USER_INFO_ERROR, error})
    }
  }
}

export function clearUserInfoError() {
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
  case USER_INFO:
    return {...state,
      isFetching: true
    }

  case USER_INFO_OK: {
    const {payload, repoName} = action
    return {...state,
      isFetching: false,
      ids: state.ids.concat(repoName),
      entities: {...state.entities,
        [repoName]: payload
      }
    }
  }

  case CLEAR_ERROR:
    return {...state,
      isFetching: false,
      isError: false,
      error: {}
    }

  case USER_INFO_ERROR:
    return {...state,
      isFetching: false,
      isError: true,
      error: action.error
    }

  default:
    return state
  }
}
