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
import RoomInfo from './RoomInfo'
import RoomSettings from './RoomSettings'
import LoginByWebView from './LoginByWebView'
import ImageLightbox from './ImageLightbox'

export default class Application {
  constructor(store, Provider) {
    this._store = store
    this._provider = Provider
    this._iconsLoaded = false

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
      RoomInfo,
      Message,
      Settings,
      SearchMessages,
      RoomSettings,
      LoginByWebView,
      ImageLightbox
    }

    Object.keys(screens).map(key => {
      Navigation.registerComponent(`gm.${key}`, () => screens[key], store, Provider)
    })
  }

  run() {
    this._store.dispatch(init())
  }

  startAppWithScreen(opts) {
    if (this._iconsLoaded) {
      this.startApp(opts)
    } else {
      iconsLoaded
      .then(() => {
        this._iconsLoaded = true
        this.startApp(opts)
      }).catch(error => {
        console.error(error) // eslint-disable-line
      })
    }
  }

  startApp({screen, passProps, showDrawer = false}) {
    const app = {
      screen: {
        screen,
        passProps,
        navigatorStyle: {
          tabBarHidden: true,
          drawUnderTabBar: true,
          disabledBackGesture: true
        }
      }
    }

    Navigation.startSingleScreenApp(Object.assign(
      app,
      showDrawer ? {drawer: {left: {screen: 'gm.Drawer'}}} : {}
    ))
  }
}
