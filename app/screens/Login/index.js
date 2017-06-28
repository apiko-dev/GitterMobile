import PropTypes from 'prop-types'
import React, { Component } from 'react'
import {Text, View} from 'react-native';
import Button from '../../components/Button'
import s from './styles'
import {connect} from 'react-redux'
import {THEMES} from '../../constants'
const {colors} = THEMES.gitterDefault


class LoginScreen extends Component {
  render() {
    const {navigator} = this.props
    return (
      <View style={s.container}>
        <Text style={s.logo}>
          GitterMobile
        </Text>
        <View style={s.buttonGroup}>
          <Button
            style={s.buttonStyle}
            onPress={() => navigator.push({screen: 'gm.LoginByWebView', animated: true, title: 'Login'})}>
            <Text pointerEvents="none"
              style={s.buttonText}>
              Login
            </Text>
          </Button>
          <Button
            style={s.buttonStyle}
            onPress={() => navigator.push({screen: 'gm.LoginByToken', animated: true, title: 'Paste token'})}>
            <Text pointerEvents="none"
              style={s.buttonText}>
              Paste token
            </Text>
          </Button>
        </View>
      </View>
    )
  }
}

LoginScreen.propTypes = {
  dispatch: PropTypes.func,
  navigator: PropTypes.object
}

LoginScreen.navigatorStyle = {
  navBarHidden: true,
  statusBarBlur: true,
  statusBarColor: colors.darkRed
}

export default connect()(LoginScreen)
