import {getItem, removeItem} from '../utils/storage'
import {getCurrentUser} from './viewer'
import {getRooms, getSuggestedRooms} from './rooms'

/**
 * Constants
 */

export const INITIALIZED = 'init/INITIALIZED'


/**
 * Action Creators
 */

export function init() {
  return async (dispatch, getState) => {
    try {
      const token = await getItem('token')
      dispatch({ type: INITIALIZED, token })

      await dispatch(getCurrentUser())
      await dispatch(getRooms())
      await dispatch(getSuggestedRooms())
    } catch (error) {
      dispatch({ type: INITIALIZED, error })
    }
  }
}
