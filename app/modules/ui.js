export const CHANGE_ROOM_INFO_DRAWER_STATE = 'ui/RoomInfo/CHANGE_ROOM_INFO_DRAWER_STATE'

export function changeRoomInfoDrawerState(state) {
  return {
    type: CHANGE_ROOM_INFO_DRAWER_STATE,
    state
  }
}

const initialState = {
  roomInfoDrawerState: 'close'
}

export default function ui(state = initialState, action) {
  switch (action.type) {

  case CHANGE_ROOM_INFO_DRAWER_STATE:
    return {...state,
      roomInfoDrawerState: action.state
    }

  default:
    return state
  }
}
