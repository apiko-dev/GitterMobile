import _ from 'lodash'
import * as Api from '../api/gitter'
import {LOGOUT} from './auth'

/**
 * Action Creators
 */

export const GROUP_ROOMS = 'groups/GROUPS_ROOMS'
export const GROUP_ROOMS_RECEIVED = 'groups/GROUP_ROOMS_RECEIVED'
export const GROUP_FOUND = 'groups/GROUP_FOUND'
export const GROUP_ROOMS_FAILED = 'groups/GROUP_ROOMS_FAILED'

export function getGroupIdByName(groupName, navigateOnSuccess = () => {}) {
  return async (dispatch, getState) => {
    try {
      const {token} = getState().auth
      const {results: rooms} = await Api.roomsByUri(token, groupName)
      const groupRegExp = new RegExp(`\\b${groupName}\/`)

      // Get group id
      const {groupId} = _.find(rooms, ({uri}) => groupRegExp.test(uri))
      const payload = {
        id: groupId,
        name: groupName
      }

      dispatch({type: GROUP_FOUND, payload})
      navigateOnSuccess(groupId)
    } catch (error) {
      console.log(error)
      // TODO: Handle error
    }
  }
}

export function getGroupRooms(groupId) {
  return async (dispatch, getState) => {
    dispatch({type: GROUP_ROOMS})

    try {
      const {token} = getState().auth

      const results = await Api.groupRooms(token, groupId)
      const payload = {
        groupId,
        rooms: results
      }

      dispatch({type: GROUP_ROOMS_RECEIVED, payload})
    } catch (error) {
      dispatch({type: GROUP_ROOMS_FAILED, error})
    }
  }
}

/**
 * Reducer
 */

const initialState = {
  isLoading: false,
  ids: [],
  groups: {},
  error: false,
  errors: []
}

export default function groups(state = initialState, action) {
  switch (action.type) {
  case GROUP_ROOMS: {
    return {...state,
      isLoading: true
    }
  }

  case GROUP_FOUND: {
    const groupId = action.payload.id
    const group = state.groups[groupId]

    return {...state,
      isLoading: false,
      ids: state.ids.concat(groupId),
      groups: {
        ...state.groups,
        [groupId]: {
          ...group,
          ...action.payload
        }
      }
    }
  }

  case GROUP_ROOMS_RECEIVED: {
    const currentGroupId = action.payload.groupId
    const group = state.groups[currentGroupId]

    return {...state,
      isLoading: false,
      ids: state.ids.concat(currentGroupId),
      groups: {
        ...state.groups,
        [currentGroupId]: {
          ...group,
          rooms: action.payload.rooms
        }
      }
    }
  }

  case GROUP_ROOMS_FAILED: {
    return {...state,
      isLoading: false,
      error: true,
      errors: action.error
    }
  }

  case LOGOUT: {
    return initialState
  }

  default :
    return state
  }
}
