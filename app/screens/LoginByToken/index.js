import React, {Component, PropTypes} from 'react';
import {TextInput, Text, Image} from 'react-native';
import s from './styles'
import {connect} from 'react-redux'
import {loginByToken} from '../../modules/auth'

import Link from '../../components/Link'
import Button from '../../components/Button'
import {THEMES} from '../../constants'
const {colors} = THEMES.gitterDefault

class LoginByTokenScreen extends Component {
  constructor(props) {
    super(props)
    this.handleLogin = this.handleLogin.bind(this)

    this.state = {
      token: ''
    }
  }

  handleLogin() {
    const {dispatch, navigator} = this.props
    const {token} = this.state
    if (!token.trim()) {
      return
    }
    dispatch(loginByToken(token, navigator))
  }

  render() {
    return (
      <Image style={s.container}
        source={require('../../images/gitter-background.jpg')}>
        <Text style={s.hero}>
          <Link to="https://developer.gitter.im/login" fontSize={24}>Sign in</Link> to Gitter
        to get your authentication token. Copy it and paste into the textinput below.
        </Text>

          <TextInput
            value={this.state.token}
            placeholder="Paste token here..."
            style={s.textfield}
            underlineColorAndroid="white"
            placeholderTextColor="black"
            onChange={(e) => this.setState({token: e.nativeEvent.text})} />
          <Button
            rippleColor={colors.raspberry}
            style={[s.buttonStyle, {backgroundColor: colors.darkRed}]}
            onPress={() => this.handleLogin()}>
            <Text pointerEvents="none"
              style={s.buttonText}>
              Submit
            </Text>
          </Button>

      </Image>
    )
  }
}

LoginByTokenScreen.navigatorStyle = {
  navBarBackgroundColor: colors.raspberry,
  navBarButtonColor: 'white',
  navBarTextColor: 'white',
  topBarElevationShadowEnabled: true,
  statusBarColor: colors.darkRed,
  statusBarTextColorScheme: 'dark'
}

LoginByTokenScreen.propTypes = {
  dispatch: PropTypes.func
}

export default connect()(LoginByTokenScreen)
