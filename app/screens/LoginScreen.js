import React, {
  Component,
  PropTypes,
  Navigator,
  BackAndroid
} from 'react-native'
import s from '../styles/LoginStyles'
import {connect} from 'react-redux'
import LoginWelcome from '../components/LoginWelcome'

const NAV_REF = 'navigator'

class LoginScreen extends Component {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    BackAndroid.addEventListener('hardwareBackPress', () => {
      const navigator = this.refs[NAV_REF]
      if (navigator && navigator.getCurrentRoutes().length > 1) {
        navigator.pop()
        return true
      }
      return false
    })
  }

  componentWillUnmount() {
    BackAndroid.removeEventListener('hardwareBackPress')
  }

  configureScene() {
    return Navigator.SceneConfigs.FadeAndroid
  }

  renderScene(route, navigator) {
    switch (route.name) {
    case 'welcome':
      return (
        <LoginWelcome navigateTo={this.navigateTo} route={route}/>
      )
    default:
      return (
        <LoginWelcome navigateTo={this.navigateTo} route={route}/>
      )
    }
  }

  render() {
    return (
      <Navigator
        style={s.container}
        ref={NAV_REF}
        initialRoute={{name: 'welcome'}}
        configureScene={this.configureScene}
        renderScene={this.renderScene} />
    )
  }
}

LoginScreen.propTypes = {

}

function mapStateToProps(state) {
  return {}
}

export default connect(mapStateToProps)(LoginScreen)
