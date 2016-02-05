import React, {
  Component,
  DrawerLayoutAndroid,
  BackAndroid,
  Navigator,
  StyleSheet,
  ToolbarAndroid,
  Text,
  View,
} from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import _ from 'lodash'

import Home from './Home'

// this need for handling android back hardware button press
let _navigator

export default class App extends Component{
  constructor(props) {
    super(props)

    this.renderDrawer = this.renderDrawer.bind(this)
    this.navigateTo = this.navigateTo.bind(this)
    this.navigateToFromDrawer = this.navigateToFromDrawer.bind(this)
    this.renderScene = this.renderScene.bind(this)

  }

  componentWillMount() {
    BackAndroid.addEventListener('hardwareBackPress', () => {
      if (_navigator && _navigator.getCurrentRoutes().length > 1) {

        _navigator.pop()
        return true
      }
      return false
    })
  }

  componentWillUnmount() {
    BackAndroid.removeEventListener('hardwareBackPress')
  }


  renderDrawer() {
    return (
      <Text>DRAWER!</Text>
    )
  }

  navigateTo(route) {
    const routes = _navigator.getCurrentRoutes()
    if (_.isEqual(route,  routes[routes.length - 1])) return false
    _navigator.push(route)
  }

  navigateToFromDrawer(route) {
    const routes = _navigator.getCurrentRoutes()
    if (_.isEqual(route,  routes[routes.length - 1])) return false
    _navigator.push(route)
    this.refs.drawer.closeDrawer()
  }


  renderScene(route, navigator) {
    // this need to back button work
    // also to pass navigator to Drawer component
    // TODO: fix it
    _navigator = navigator

    // map routes by name
    switch (route.name) {
      case 'home':
        return (
          <Home navigateTo={this.navigateTo} route={route}/>
        )
      default:
        return (
          <Home navigateTo={this.navigateTo} route={route}/>
        )
    }
  }

  configureScene(route) {
    if (route.name === 'search')
      return Navigator.SceneConfigs.FloatFromBottomAndroid
    else if (!!route.sceneConfig && route.name !== 'search')
      return Navigator.SceneConfigs[route.sceneConfig]
    else
      return Navigator.SceneConfigs.FadeAndroid
  }

  render() {
    const initialRoute = {name: 'home'}

      return (
        <DrawerLayoutAndroid
          ref='drawer'
          style={{backgroundColor: 'white'}}
          drawerWidth={300}
          drawerPosition={DrawerLayoutAndroid.positions.Left}
          renderNavigationView={this.renderDrawer.bind(this)}
        >
          <Navigator
            style={styles.container}
            ref="nav"
            initialRoute={initialRoute}
            configureScene={this.configureScene}
            renderScene={this.renderScene}
          />
        </DrawerLayoutAndroid>
      )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})
