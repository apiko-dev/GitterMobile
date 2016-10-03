export const RECEIVE_ROOM_EVENTS_SNAPSHOT = 'activity/RECEIVE_ROOM_EVENTS_SNAPSHOT'

export function receiveRoomEventsSnapshot(roomId, snapshot) {
  return {
    type: RECEIVE_ROOM_EVENTS_SNAPSHOT,
    snapshot,
    roomId
  }
}

const initialState = {
  byRoom: {
    // [id]: []
  }
}

export default function activity(state = initialState, action) {
  switch (action.type) {
  case RECEIVE_ROOM_EVENTS_SNAPSHOT:
    return {
      byRoom: {...state.byRoom,
        [action.roomId]: action.snapshot
      }
    }
  default:
    return state
  }
}
