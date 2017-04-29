import React, {Component, PropTypes} from 'react';
import {Text, Image, View, ToastAndroid} from 'react-native';
import Button from '../../components/Button'
import s from './styles'
import {connect} from 'react-redux'
import {THEMES} from '../../constants'
const {colors} = THEMES.gitterDefault


class LoginScreen extends Component {
  render() {
    const {navigator} = this.props
    return (
      <Image style={s.container}
        source={require('../../images/gitter-background.jpg')}>
        <Text style={s.logo}>
          GitterMobile
        </Text>
        <Text style={s.hero}>
          To start using Gitter mobile you should login first.
          You can login by oauth2 through WebView or just
          copy/paste authentication token.
        </Text>
        <View style={s.buttonGroup}>
          <Button
            style={[s.buttonStyle, {backgroundColor: colors.darkRed}]}
            onPress={() => ToastAndroid.show('Login by WebView is not supported yet', ToastAndroid.SHORT)}>
            <Text pointerEvents="none"
              style={s.buttonText}>
              Login by WebView
            </Text>
          </Button>
          <Button
            style={[s.buttonStyle, {backgroundColor: colors.darkRed}]}
            onPress={() => navigator.push({screen: 'gm.LoginByToken', animated: true, title: 'Login by token'})}>
            <Text pointerEvents="none"
              style={s.buttonText}>
              Login by Token
            </Text>
          </Button>
        </View>
      </Image>
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
