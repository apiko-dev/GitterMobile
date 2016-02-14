import React, {
  Component,
  PropTypes,
  Navigator,
  BackAndroid
} from 'react-native'
import s from '../styles/LoginStyles'
import {connect} from 'react-redux'
import LoginWelcome from '../components/LoginWelcome'
import LoginByToken from '../components/LoginByToken'

const NAV_REF = 'navigator'

class LoginScreen extends Component {
  constructor(props) {
    super(props)

    this.renderScene = this.renderScene.bind(this)
    this.handleByToken = this.handleByToken.bind(this)
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

  handleByToken() {
    this.refs[NAV_REF].push({name: 'byToken'})
  }

  renderScene(route, navigator) {
    switch (route.name) {
    case 'welcome':
      return (
        <LoginWelcome onToken={this.handleByToken.bind(this)}/>
      )
    case 'byToken':
      return (
        <LoginByToken navigateTo={this.navigateTo} route={route}/>
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
