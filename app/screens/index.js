import {Navigation} from 'react-native-navigation'
import {iconsLoaded} from '../utils/iconsMap'

import {init} from '../modules/app'

import Launch from './Launch'
import Login from './Login'
import LoginByToken from './LoginByToken'
import NoInternet from './NoInternet'
import Home from './Home'
import Room from './Room'
import Search from './Search'
import User from './User'
import Drawer from './Drawer'
import RoomUsers from './RoomUsers'
import RoomUserAdd from './RoomUserAdd'
import Message from './Message'
import Settings from './Settings'
import SearchMessages from './SearchMessages'
import RoomSettings from './RoomSettings'

export default class Application {
  constructor(store, Provider) {
    this._store = store
    this._provider = Provider

    this._configureScreens(store, Provider)
  }

  _configureScreens(store, Provider) {
    const screens = {
      Launch,
      Login,
      LoginByToken,
      NoInternet,
      Home,
      Room,
      Search,
      User,
      Drawer,
      RoomUsers,
      RoomUserAdd,
      Message,
      Settings,
      SearchMessages,
      RoomSettings
    }

    Object.keys(screens).map(key => {
      Navigation.registerComponent(`gm.${key}`, () => screens[key], store, Provider)
    })
  }

  run() {
    this._store.dispatch(init(this.startAppWithScreen))
  }

  startAppWithScreen({screen, passProps}) {
    iconsLoaded
    .then(() =>
      Navigation.startSingleScreenApp({
        screen: {
          screen,
          passProps,
          navigatorStyle: {
            tabBarHidden: true,
            drawUnderTabBar: true,
            disabledBackGesture: true
          }
        },
        drawer: {
          left: {
            screen: 'gm.Drawer'
          }
        }
        // animationType: 'none'
      })
    ).catch(error => {
      console.error(error) // eslint-disable-line
    })
  }
}
