import {AsyncStorage} from 'react-native'

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
      const token = await AsyncStorage.getItem('token')
      dispatch({ type: INITIALIZED, token })
    } catch (error) {
      dispatch({ type: INITIALIZED, error })
    }
  }
}
