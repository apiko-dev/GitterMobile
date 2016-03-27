import React, {
  Component,
  PropTypes,
  DrawerLayoutAndroid,
  BackAndroid,
  Navigator
} from 'react-native'
import _ from 'lodash'
import {init} from '../modules/app'
import {connect} from 'react-redux'
import * as Navigation from '../modules/navigation'
import {selectRoom} from '../modules/rooms'
import {changeRoomInfoDrawerState} from '../modules/ui'

import LaunchScreen from './LaunchScreen'
import LoginScreen from './LoginScreen'
import LoginByTokenScreen from './LoginByTokenScreen'
import NoInternetScreen from './NoInternetScreen'
import HomeScreen from './HomeScreen'
import RoomScreen from './RoomScreen'
import SearchScreen from './SearchScreen'
import UserScreen from './UserScreen'
import Drawer from './Drawer'
import RoomUsersScreen from './RoomUsersScreen'
import RoomUserAddScreen from './RoomUserAddScreen'

// this need for passing navigator instance to navigation module
export let nav

class App extends Component {
  constructor(props) {
    super(props)

    this.renderDrawer = this.renderDrawer.bind(this)
    this.navigateTo = this.navigateTo.bind(this)
    this.navigateToFromDrawer = this.navigateToFromDrawer.bind(this)
    this.onMenuTap = this.onMenuTap.bind(this)
    this.renderScene = this.renderScene.bind(this)

    this.state = {
      isDrawerOpen: false
    }
  }

  componentDidMount() {
    const {dispatch} = this.props
    // init application
    dispatch(init())

    BackAndroid.addEventListener('hardwareBackPress', () => {
      if (this.state.isDrawerOpen === true) {
        this.refs.drawer.closeDrawer()
        return true
      }
      const {prevision, history} = this.props.navigation

      if (history.length > 1) {
        // set active room previous room
        if (prevision.name === 'room') {
          dispatch(selectRoom(prevision.roomId))
        } else {
          dispatch(selectRoom(''))
        }
        dispatch(Navigation.goBack())
        return true
      }
      return false
    })
  }

  componentWillUnmount() {
    BackAndroid.removeEventListener('hardwareBackPress')
  }

  onMenuTap() {
    this.refs.drawer.openDrawer()
  }

  navigateTo(route) {
    const {dispatch, navigation: {current}} = this.props
    if (_.isEqual(route, current)) {
      return false
    }
    dispatch(Navigation.goTo(route))
  }

  navigateToFromDrawer(route) {
    const {dispatch, navigation: {current}} = this.props

    if (_.isEqual(route, current)) {
      return false
    }

    this.refs.drawer.closeDrawer()

    // delay is needed for smoothly drawer closing
    setTimeout(() => {
      if (current.name === 'room' && route.name === 'room') {
        dispatch(Navigation.goAndReplace(route))
      } else if (route.name === 'room') {
        dispatch(Navigation.resetWithStack([{name: 'home'}, route]))
      } else {
        dispatch(Navigation.goTo(route))
      }
    }, 300)
  }


  configureScene(route) {
    if (route.name === 'search') {
      return Navigator.SceneConfigs.FloatFromBottomAndroid
    } else if (!!route.sceneConfig && route.name !== 'search') {
      return Navigator.SceneConfigs[route.sceneConfig]
    } else {
      return Navigator.SceneConfigs.FadeAndroid
    }
  }

  renderScene(route, navigator) {
    // map routes by name
    switch (route.name) {
    case 'launch':
      return (
        <LaunchScreen />
      )
    case 'noInternet':
      return (
        <NoInternetScreen />
      )
    case 'login':
      return (
        <LoginScreen />
      )
    case 'loginByToken':
      return (
        <LoginByTokenScreen />
      )
    case 'home':
      return (
        <HomeScreen
          navigateTo={this.navigateTo}
          onMenuTap={this.onMenuTap.bind(this)} />
      )
    case 'room':
      return (
        <RoomScreen
          route={route}
          navigateTo={this.navigateTo}
          onMenuTap={this.onMenuTap.bind(this)} />
      )
    case 'user':
      return (
        <UserScreen
          route={route} />
      )

    case 'search':
      return (
        <SearchScreen />
      )

    case 'roomUsers':
      return (
        <RoomUsersScreen
          route={route} />
      )

    case 'addUser':
      return (
        <RoomUserAddScreen
          route={route} />
      )

    default:
      return null
    }
  }


  renderDrawer() {
    return (
      <Drawer
        navigateTo={this.navigateToFromDrawer.bind(this)} />
    )
  }

  render() {
    const {navigation} = this.props
    // const initialRoute = {name: 'launch'}
    // const initialRoute = {name: 'room', roomId: '56a41e0fe610378809bde160'}
    const drawerLockMode = ['launch', 'login', 'loginByToken'].indexOf(navigation.current.name) === -1
      ? 'unlocked'
      : 'locked-closed'

    return (
      <DrawerLayoutAndroid
        ref="drawer"
        drawerLockMode={drawerLockMode}
        style={{backgroundColor: 'white'}}
        drawerWidth={300}
        drawerPosition={DrawerLayoutAndroid.positions.Left}
        renderNavigationView={this.renderDrawer.bind(this)}
        onDrawerOpen={() => this.setState({isDrawerOpen: true})}
        onDrawerClose={() => this.setState({isDrawerOpen: false})}
        keyboardDismissMode="on-drag">
        <Navigator
          style={{flex: 1}}
          ref={ref => nav = ref}
          initialRoute={navigation.init}
          configureScene={this.configureScene}
          renderScene={this.renderScene}/>
      </DrawerLayoutAndroid>
    )
  }
}

App.propTypes = {
  dispatch: PropTypes.func,
  navigation: PropTypes.object,
  roomInfoDrawerState: PropTypes.string
}

function mapStateToProps(state) {
  const {roomInfoDrawerState} = state.ui
  return {
    navigation: state.navigation,
    roomInfoDrawerState
  }
}

export default connect(mapStateToProps)(App)
