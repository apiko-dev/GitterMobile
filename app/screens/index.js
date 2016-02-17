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
      return <MainNavigator dispatch={this.props.dispatch}/>
    } else {
      return <LoginScreen />
    }
  }
}

App.propTypes = {
  isLoginedIn: PropTypes.bool,
  token: PropTypes.string,
  dispatch: PropTypes.func
}

function mapStateToProps(state) {
  const {isLoginedIn, token} = state.auth
  return {
    isLoginedIn,
    token
  }
}

export default connect(mapStateToProps)(App)
