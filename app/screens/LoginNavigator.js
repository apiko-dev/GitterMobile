import React, {
  Component,
  PropTypes,
  Navigator,
  BackAndroid
} from 'react-native'
import s from '../styles/LoginStyles'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {loginByToken} from '../modules/auth'
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
        <LoginWelcome onToken={this.handleByToken.bind(this)} />
      )
    case 'byToken':
      return (
        <LoginByToken onSubmit={this.props.loginByToken} />
      )
    default:
      return (
        <LoginWelcome onToken={this.handleByToken.bind(this)} />
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
  loginByToken: PropTypes.func.isRequired
}

function mapDispatchToProps(dispatch) {
  return {
    loginByToken: bindActionCreators(loginByToken, dispatch)
  }
}

export default connect(state => state, mapDispatchToProps)(LoginScreen)
