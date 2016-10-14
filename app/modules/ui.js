import {getItem, setItem, removeItem} from '../utils/storage'

export const INITIALIZE_UI = 'ui/INITIALIZE_UI'
export const CHANGE_ROOM_INFO_DRAWER_STATE = 'ui/RoomInfo/CHANGE_ROOM_INFO_DRAWER_STATE'
export const TOGGLE_DRAWER_SECTION_STATE = 'ui/TOGGLE_DRAWER_SECTION_STATE'

export function initializeUi() {
  return async (dispatch, getState) => {
    const sectionsStateFromStore = await getItem('sectionsState')
    if (!sectionsStateFromStore) {
      const {sectionsState} = getState().ui
      await setItem('sectionsState', JSON.stringify(sectionsState))
    } else {
      dispatch({type: INITIALIZE_UI, payload: {
        sectionsState: JSON.parse(sectionsStateFromStore)
      }})
    }
  }
}

export function toggleDrawerSectionState(sectionName, oldState) {
  return async (dispatch, getState) => {
    dispatch({type: TOGGLE_DRAWER_SECTION_STATE, sectionName, newState: !oldState})

    const {sectionsState} = getState().ui
    await setItem('sectionsState', JSON.stringify(sectionsState))
  }
}

export function changeRoomInfoDrawerState(state) {
  return {
    type: CHANGE_ROOM_INFO_DRAWER_STATE,
    state
  }
}

const initialState = {
  roomInfoDrawerState: 'close',
  sectionsState: {
    Favorites: false,
    Unread: false,
    Channels: false,
    Organizations: false
  }
}

export default function ui(state = initialState, action) {
  switch (action.type) {

  case INITIALIZE_UI:
    return Object.assign({}, state, action.payload)

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

  default:
    return state
  }
}
