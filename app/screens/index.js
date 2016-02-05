import React, {
  Component,
  StyleSheet,
} from 'react-native'
import {connect} from 'react-redux'


import MainNavigator from './MainNavigator'
import LoginScreen from './LoginScreen'

class App extends Component{
  constructor(props) {
    super(props)

  }

  render() {
    const {isLoginedIn, token} = this.props
    if (!isLoginedIn && token) {
      return (
        <MainNavigator />
      )
    } else {
      return (
        <LoginScreen />
      )
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})

export default connect(state => {
  const {isLoginedIn, token} = state.auth
  return {
    isLoginedIn,
    token
  }
})(App)
