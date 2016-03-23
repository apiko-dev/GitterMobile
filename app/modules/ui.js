export const CHANGE_ROOM_INFO_TAB = 'ui/RoomInfo/CHANGE_ROOM_INFO_TAB'
export const CHANGE_ROOM_INFO_DRAWER_STATE = 'ui/RoomInfo/CHANGE_ROOM_INFO_DRAWER_STATE'

export function changeRoomInfoTab(index) {
  return {
    type: CHANGE_ROOM_INFO_TAB,
    index
  }
}

export function changeRoomInfoDrawerState(state) {
  return {
    type: CHANGE_ROOM_INFO_DRAWER_STATE,
    state
  }
}

const initialState = {
  roomInfoActiveTab: 0,
  roomInfoDrawerState: 'close',
  roomInfoDrawerVisibility: 'show'
}

export default function ui(state = initialState, action) {
  switch (action.type) {
  case CHANGE_ROOM_INFO_TAB:
    return {...state,
      roomInfoActiveTab: action.index
    }

  case CHANGE_ROOM_INFO_DRAWER_STATE:
    return {...state,
      roomInfoDrawerState: action.state
    }

  default:
    return state
  }
}
