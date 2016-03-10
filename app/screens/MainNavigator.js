import React, {
  Component,
  PropTypes,
  DrawerLayoutAndroid,
  BackAndroid,
  Navigator
} from 'react-native'
import _ from 'lodash'
import {connect} from 'react-redux'
import {selectRoom} from '../modules/rooms'

import HomeScreen from './HomeScreen'
import RoomScreen from './RoomScreen'
import Drawer from './Drawer'

// this need for handling android back hardware button press
export let navigation

class MainNavigator extends Component {
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
    BackAndroid.addEventListener('hardwareBackPress', () => {
      const routes = navigation.getCurrentRoutes()

      if (this.state.isDrawerOpen === true) {
        this.refs.drawer.closeDrawer()
        return true
      }
      if (navigation && routes.length > 1) {
        // set active room previous room
        if (routes[routes.length - 2].name === 'room') {
          this.props.dispatch(selectRoom(routes[routes.length - 2].roomId))
        } else {
          this.props.dispatch(selectRoom(''))
        }
        navigation.pop()
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
    const routes = navigation.getCurrentRoutes()
    if (_.isEqual(route, routes[routes.length - 1])) return false
    navigation.push(route)
  }

  navigateToFromDrawer(route) {
    const routes = navigation.getCurrentRoutes()
    if (_.isEqual(route, routes[routes.length - 1])) {
      return false
    }

    this.refs.drawer.closeDrawer()

    // delay is needed for smoothly drawer closing
    setTimeout(() => {
      if (routes[routes.length - 1].name === 'room' && route.name === 'room') {
        navigation.replace(route)
      } else {
        navigation.push(route)
      }
    }, 500)
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
    // this need to back button work
    // also to pass navigator to Drawer component
    // TODO: fix it
    navigation = navigator

    // map routes by name
    switch (route.name) {
    case 'home':
      return (
        <HomeScreen
          navigateTo={this.navigateTo}
          route={route}
          onMenuTap={this.onMenuTap.bind(this)} />
      )
    case 'room':
      return (
        <RoomScreen
          navigateTo={this.navigateTo}
          route={route}
          onMenuTap={this.onMenuTap.bind(this)} />
      )
    default:
      return (
        <HomeScreen navigateTo={this.navigateTo} route={route}/>
      )
    }
  }


  renderDrawer() {
    return (
      <Drawer
        navigator={this.navigateToFromDrawer.bind(this)} />
    )
  }

  render() {
    const initialRoute = {name: 'home'}
    // const initialRoute = {name: 'room', roomId: '56a41e0fe610378809bde160'}

    return (
      <DrawerLayoutAndroid
        ref="drawer"
        style={{backgroundColor: 'white'}}
        drawerWidth={300}
        drawerPosition={DrawerLayoutAndroid.positions.Left}
        renderNavigationView={this.renderDrawer.bind(this)}
        onDrawerOpen={() => this.setState({isDrawerOpen: true})}
        onDrawerClose={() => this.setState({isDrawerOpen: false})}>
        <Navigator
          style={{flex: 1}}
          ref="nav"
          initialRoute={initialRoute}
          configureScene={this.configureScene}
          renderScene={this.renderScene}/>
      </DrawerLayoutAndroid>
    )
  }
}

MainNavigator.propTypes = {
  dispatch: PropTypes.func
}

export default connect()(MainNavigator)
