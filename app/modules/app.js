import {getItem} from '../utils/storage'
import {getCurrentUser} from './viewer'
import {getRooms, getSuggestedRooms} from './rooms'
import {initializeUi} from './ui'
import {NetInfo, AppState} from 'react-native'
import {
  setupFayeEvents,
  setupFaye,
  onNetStatusChangeFaye,
  subscribeToChatMessages,
  subscribeToRooms
} from './realtime'
import {rootNavigator} from '../index'
import * as GithubApi from '../api/github'
import {Alert, Linking} from 'react-native'

/**
 * Constants
 */

export const INITIALIZED = 'app/INITIALIZED'
export const CHANGE_NET_STATUS = 'app/CHANGE_NET_STATUS'
export const CHANGE_APP_STATE = 'app/CHANGE_APP_STATE'

/**
 * Action Creators
 */
export function init() {
  return async (dispatch, getState) => {
    dispatch(setupAppStatusListener())
    try {
      // debugger
      // checking internet connection
      const netStatus = await NetInfo.fetch()
      if (netStatus === 'none' || netStatus === 'NONE') {
        rootNavigator.startAppWithScreen({screen: 'gm.NoInternet'})
        return
      }

      const token = await getItem('token')
      if (!token) {
        rootNavigator.startAppWithScreen({screen: 'gm.Login', showDrawer: false})
        return
      }

      dispatch({ type: INITIALIZED, token })

      rootNavigator.startAppWithScreen({screen: 'gm.Home', showDrawer: true})
      // getting base current user's information
      await dispatch(getCurrentUser())

      await Promise.all([
        dispatch(initializeUi()),
        dispatch(getRooms())
      ])

      dispatch(setupNetStatusListener())
      // if you need debug room screen, just comment nevigation to 'hone'
      // and uncomment navigation to 'room'
      // dispatch(Navigation.resetTo({name: 'user', userId: '52ce7f4eed5ab0b3bf053782', username: 'blia'}))
      // dispatch(Navigation.resetTo({name: 'room', roomId: '54774579db8155e6700d8cc6'}))
      await Promise.all([
        dispatch(setupFayeEvents()),
        dispatch(setupFaye()),
        dispatch(getSuggestedRooms())
      ])
      // dispatch(Navigation.resetTo({name: 'roomUsers', roomId: '56a41e0fe610378809bde160'}))
      await dispatch(checkNewReleases())
    } catch (error) {
      dispatch({ type: INITIALIZED, error: error.message })
      rootNavigator.startAppWithScreen({screen: 'gm.Login'})
    }
  }
}

function setupNetStatusListener() {
  return dispatch => {
    NetInfo.isConnected.addEventListener('change',
      async status => {
        dispatch({type: CHANGE_NET_STATUS, payload: status})
        await dispatch(onNetStatusChangeFaye(status))
      }
    );
  }
}

function setupAppStatusListener() {
  return (dispatch, getState) => {
    AppState.addEventListener('change', async status => {
      // TODO: Update drawer rooms state and messages in current room
      // if app status changes from backgrount to active
      try {
        dispatch({type: CHANGE_APP_STATE, payload: status})
        const {token} = getState().auth
        const netStatus = getState().app.status
        if (!token.length || !netStatus) {
          return
        }
        const {fayeConnected} = getState().app
        if (!fayeConnected) {
          await setupFaye()
        }

        const {activeRoom} = getState().rooms
        if (!!activeRoom) {
          dispatch(subscribeToChatMessages(activeRoom))
        }
        dispatch(subscribeToRooms())
      } catch (error) {
        // console.log(error)
      }
    })
  }
}

export function checkNewReleases() {
  return async dispatch => {
    try {
      const payload = await GithubApi.checkNewReleases()
      // console.log(payload)
      if (payload[0].name !== global.CURRENT_VERSION) {
        Alert.alert(
          'New version available',
          'Do you want to visit releases page?',
          [
            {text: 'Later', onPress: () => console.log('Later Pressed!')},
            {text: 'Yes', onPress: () => Linking.openURL(payload[0].html_url)}
          ]
        )
      }
    } catch (error) {
      // console.log(error)
    }
  }
}


/**
 * Reducer
 */

const initialState = {
  online: false,
  appState: null,
  fayeConnected: false
}

export default function app(state = initialState, action) {
  switch (action.type) {
  case INITIALIZED:
    // return {...state,
    //   online: action.netStatus
    // }
    return state

  case CHANGE_NET_STATUS:
    return {...state,
      online: action.payload
    }

  case CHANGE_APP_STATE:
    return {...state,
      appState: action.payload
    }

  default:
    return state
  }
}
