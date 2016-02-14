import React, {
  Component,
  PropTypes,
  Text,
  Image,
  View
} from 'react-native'
import s from '../styles/LoginWelcomeStyles'
import {MKButton} from 'react-native-material-kit'


export default class LoginWelcome extends Component {
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
          <MKButton
            style={s.buttonStyle}
            onPress={() => {}}>
            <Text pointerEvents="none"
              style={s.buttonText}>
              Login by WebView
            </Text>
          </MKButton>
          <MKButton
            style={s.buttonStyle}
            onPress={() => this.props.onToken()}>
            <Text pointerEvents="none"
              style={s.buttonText}>
              Login by token
            </Text>
          </MKButton>
        </View>
      </Image>
    )
  }
}

LoginWelcome.propTypes = {
  onToken: PropTypes.func.isRequired
}
