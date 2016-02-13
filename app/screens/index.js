import React, {
  Component,
  PropTypes
} from 'react-native'
import {connect} from 'react-redux'

import MainNavigator from './MainNavigator'
import LoginScreen from './LoginScreen'

class App extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const {isLoginedIn, token} = this.props
    if (!isLoginedIn && token) {
      return <MainNavigator />
    } else {
      return <LoginScreen />
    }
  }
}

App.propTypes = {
  isLoginedIn: PropTypes.bool,
  token: PropTypes.string
}


export default connect(state => {
  const {isLoginedIn, token} = state.auth
  return {
    isLoginedIn,
    token
  }
})(App)
