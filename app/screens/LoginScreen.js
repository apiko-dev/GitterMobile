import React, {
  Component,
  PropTypes,
  TouchableNativeFeedback,
  Text,
  Image,
  View
} from 'react-native'
import s from '../styles/LoginScreenStyles'
import {THEMES} from '../constants'
const {colors} = THEMES.gitterDefault


export default class LoginScreen extends Component {
  render() {
    return (
      <Image style={s.container}
        source={require('../images/gitter-background.jpg')}>
        <Text style={s.logo}>
          GitterMobile
        </Text>
        <Text style={s.hero}>
          To start using Gitter mobile you should login first.
          You can login by oauth2 through WebView or just
          copy/paste authentication token.
        </Text>
        <View style={s.buttonGroup}>
          <TouchableNativeFeedback
            background={TouchableNativeFeedback.Ripple(colors.raspberry, false)}
            onPress={() => {}}>
            <View style={[s.buttonStyle, {backgroundColor: colors.darkRed}]}>
              <Text pointerEvents="none"
                style={s.buttonText}>
                Login by WebView
              </Text>
          </View>
          </TouchableNativeFeedback>
          <TouchableNativeFeedback
            background={TouchableNativeFeedback.Ripple(colors.raspberry, false)}
            onPress={() => {}}>
            <View style={[s.buttonStyle, {backgroundColor: colors.darkRed}]}>
              <Text pointerEvents="none"
                style={s.buttonText}>
                Login by Token
              </Text>
            </View>
          </TouchableNativeFeedback>
        </View>
      </Image>
    )
  }
}

LoginScreen.propTypes = {
  onToken: PropTypes.func.isRequired
}
