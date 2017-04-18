import React, {Component, PropTypes} from 'react';
import {BackAndroid, Navigator, DrawerLayoutAndroid, Platform} from 'react-native';
import _ from 'lodash'
import {connect} from 'react-redux'
import {Navigation} from 'react-native-navigation'
import {iconsLoaded} from '../utils/iconsMap'

import DrawerLayoutJs from 'react-native-drawer-layout'

import {init} from '../modules/app'
// import * as Navigation from '../modules/navigation'
import {selectRoom} from '../modules/rooms'
// import {changeRoomInfoDrawerState} from '../modules/ui'

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

import {THEMES} from '../constants'
const {colors} = THEMES.gitterDefault

// this need for passing navigator instance to navigation module
export let nav
// const DrawerLayout = Platform.OS === 'ios' ? DrawerLayoutJs : DrawerLayoutAndroid

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

  startAppWithScreen({screen, passProps = {}}) {
    iconsLoaded
    .then(() =>
      Navigation.startSingleScreenApp({
        screen: {
          screen,
          passProps,
          navigatorStyle: {
            tabBarHidden: true,
            drawUnderTabBar: true
          }
        },
        drawer: {
          left: {
            screen: 'gm.Drawer'
          }
        },
        // animationType: 'none'
      })
    ).catch(error => {
      debugger
    })
  }
}

// class AppOld extends Component {
//   constructor(props) {
//     super(props)
//
//     this.renderDrawer = this.renderDrawer.bind(this)
//     this.navigateTo = this.navigateTo.bind(this)
//     this.navigateToFromDrawer = this.navigateToFromDrawer.bind(this)
//     this.onMenuTap = this.onMenuTap.bind(this)
//     this.renderScene = this.renderScene.bind(this)
//
//     this.state = {
//       isDrawerOpen: false
//     }
//   }
//
//   componentDidMount() {
//     const {dispatch} = this.props
//     // init application
//
//
//     BackAndroid.addEventListener('hardwareBackPress', () => {
//       if (this.state.isDrawerOpen === true) {
//         this.refs.drawer.closeDrawer()
//         return true
//       }
//       const {prevision, history} = this.props.navigation
//
//       if (history.length > 1) {
//         // set active room previous room
//         if (prevision.name === 'room') {
//           dispatch(selectRoom(prevision.roomId))
//         } else {
//           dispatch(selectRoom(''))
//         }
//         dispatch(Navigation.goBack())
//         return true
//       }
//       return false
//     })
//   }
//
//   componentWillUnmount() {
//     BackAndroid.removeEventListener('hardwareBackPress')
//   }
//
//   onMenuTap() {
//     this.refs.drawer.openDrawer()
//   }
//
//   navigateTo(route) {
//     const {dispatch, navigation: {current}} = this.props
//     if (_.isEqual(route, current)) {
//       return false
//     }
//     dispatch(Navigation.goTo(route))
//   }
//
//   navigateToFromDrawer(route) {
//     const {dispatch, navigation: {current}} = this.props
//
//     if (_.isEqual(route, current)) {
//       return false
//     }
//
//     this.refs.drawer.closeDrawer()
//
//     // delay is needed for smoothly drawer closing
//     setTimeout(() => {
//       if (current.name === 'room' && route.name === 'room') {
//         dispatch(Navigation.goAndReplace(route))
//       } else if (route.name === 'room') {
//         dispatch(Navigation.resetWithStack([{name: 'home'}, route]))
//       } else {
//         dispatch(Navigation.goTo(route))
//       }
//     })
//   }
//
//
//   configureScene(route) {
//     if (route.name === 'search') {
//       return Navigator.SceneConfigs.FloatFromBottomAndroid
//     } else if (!!route.sceneConfig && route.name !== 'search') {
//       return Navigator.SceneConfigs[route.sceneConfig]
//     } else {
//       return Navigator.SceneConfigs.FadeAndroid
//     }
//   }
//
//   renderScene(route, navigator) {
//     // map routes by name
//     switch (route.name) {
//     case 'launch':
//       return (
//         <Launch />
//       )
//     case 'noInternet':
//       return (
//         <NoInternet />
//       )
//     case 'login':
//       return (
//         <Login />
//       )
//     case 'loginByToken':
//       return (
//         <LoginByToken />
//       )
//     case 'home':
//       return (
//         <Home
//           navigateTo={this.navigateTo}
//           onMenuTap={this.onMenuTap.bind(this)} />
//       )
//     case 'room':
//       return (
//         <Room
//           route={route}
//           navigateTo={this.navigateTo}
//           onMenuTap={this.onMenuTap.bind(this)} />
//       )
//     case 'user':
//       return (
//         <User
//           route={route} />
//       )
//
//     case 'search':
//       return (
//         <Search />
//       )
//
//     case 'roomUsers':
//       return (
//         <RoomUsers
//           route={route} />
//       )
//
//     case 'addUser':
//       return (
//         <RoomUserAdd
//           route={route} />
//       )
//
//     case 'message':
//       return (
//         <Message
//           route={route} />
//       )
//
//     case 'settings':
//       return (
//         <Settings />
//       )
//
//     case 'searchMessages':
//       return (
//         <SearchMessages
//           route={route} />
//       )
//
//     case 'roomSettings':
//       return (
//         <RoomSettings
//           route={route} />
//       )
//
//     default:
//       return null
//     }
//   }
//
//
//   renderDrawer() {
//     return (
//       <Drawer
//         navigateTo={this.navigateToFromDrawer.bind(this)} />
//     )
//   }
//
//   render() {
//     const {navigation} = this.props
//     // const initialRoute = {name: 'launch'}
//     // const initialRoute = {name: 'room', roomId: '56a41e0fe610378809bde160'}
//     const drawerLockMode = ['home', 'room']
//       .indexOf(navigation.current.name) !== -1
//         ? 'unlocked'
//         : 'locked-closed'
//
//     return (
//       <DrawerLayout
//         ref="drawer"
//         drawerLockMode={drawerLockMode}
//         statusBarBackgroundColor={colors.darkRed}
//         style={{backgroundColor: 'white'}}
//         drawerWidth={300}
//         drawerPosition={DrawerLayout.positions.Left}
//         renderNavigationView={this.renderDrawer.bind(this)}
//         onDrawerOpen={() => this.setState({isDrawerOpen: true})}
//         onDrawerClose={() => this.setState({isDrawerOpen: false})}
//         keyboardDismissMode="on-drag">
//         <Navigator
//           style={{flex: 1}}
//           ref={ref => nav = ref}
//           initialRoute={navigation.init}
//           configureScene={this.configureScene}
//           renderScene={this.renderScene}/>
//       </DrawerLayout>
//     )
//     // return <View />
//   }
// }
//
// AppOld.propTypes = {
//   dispatch: PropTypes.func,
//   navigation: PropTypes.object,
//   roomInfoDrawerState: PropTypes.string
// }
//
// function mapStateToProps(state) {
//   const {roomInfoDrawerState} = state.ui
//   return {
//     navigation: state.navigation,
//     roomInfoDrawerState
//   }
// }

// export default connect(mapStateToProps)(AppOld)
