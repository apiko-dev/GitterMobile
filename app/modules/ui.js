import {getItem, setItem, removeItem} from '../utils/storage'

export const INITIALIZE_UI = 'ui/INITIALIZE_UI'
export const CHANGE_ROOM_INFO_DRAWER_STATE = 'ui/RoomInfo/CHANGE_ROOM_INFO_DRAWER_STATE'
export const TOGGLE_DRAWER_SECTION_STATE = 'ui/TOGGLE_DRAWER_SECTION_STATE'
export const SET_ROOM_INPUT_STATE = 'ui/SET_ROOM_INPUT_STATE'

export function initializeUi() {
  return async dispatch => {
    const payload = await getItem('uiReducer')

    dispatch({
      type: INITIALIZE_UI,
      payload: typeof payload === 'string'
        ? JSON.parse(payload)
        : payload
    })
  }
}

export function toggleDrawerSectionState(sectionName, oldState) {
  return async dispatch => {
    dispatch({type: TOGGLE_DRAWER_SECTION_STATE, sectionName, newState: !oldState})

    await dispatch(saveReducerToStorage())
  }
}

export function setRoomTextInputState(roomId, text) {
  return async dispatch => {
    dispatch({type: SET_ROOM_INPUT_STATE, roomId, text})

    await dispatch(saveReducerToStorage())
  }
}

export function changeRoomInfoDrawerState(state) {
  return {
    type: CHANGE_ROOM_INFO_DRAWER_STATE,
    state
  }
}

function saveReducerToStorage() {
  return async (dispatch, getState) => {
    await setItem('uiReducer', JSON.stringify(getState().ui))
  }
}

const initialState = {
  roomInfoDrawerState: 'close',
  sectionsState: {
    Favorites: false,
    Unread: false,
    Channels: false,
    Organizations: false
  },
  roomInputStateById: {}
}

export default function ui(state = initialState, action) {
  switch (action.type) {

  case INITIALIZE_UI:
    return Object.assign({}, state, action.payload || initialState)

  case CHANGE_ROOM_INFO_DRAWER_STATE:
    return {...state,
      roomInfoDrawerState: action.state
    }

  case TOGGLE_DRAWER_SECTION_STATE:
    return {...state,
      sectionsState: {...state.sectionsState,
        [action.sectionName]: action.newState
      }
    }

  case SET_ROOM_INPUT_STATE:
    return {...state,
      roomInputStateById: {...state.roomInputStateById,
        [action.roomId]: action.text
      }
    }

  default:
    return state
  }
}
