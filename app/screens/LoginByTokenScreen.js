import React, {
  Component,
  PropTypes,
  TouchableNativeFeedback,
  TextInput,
  View,
  Text,
  Image
} from 'react-native'
import s from '../styles/screens/Login/LoginByTokenScreenStyles'
import {connect} from 'react-redux'
import {loginByToken} from '../modules/auth'

import Link from '../components/Link'
import {THEMES} from '../constants'
const {colors} = THEMES.gitterDefault

export default class LoginByTokenScreen extends Component {
  constructor(props) {
    super(props)
    this.handleLogin = this.handleLogin.bind(this)

    this.state = {
      token: ''
    }
  }

  handleLogin() {
    const {dispatch} = this.props
    const {token} = this.state
    if (!token.trim()) {
      return
    }
    dispatch(loginByToken(token))
  }

  render() {
    return (
      <Image style={s.container}
        source={require('../images/gitter-background.jpg')}>
        <Text style={s.logo}>
          Login by token
        </Text>
        <Text style={s.hero}>
          Follow this<Link to="https://developer.gitter.im/apps" fontSize={24}> link </Link>
        to get your authentication token. Copy it and paste into the textinput below.
        </Text>

          <TextInput
            value={this.state.token}
            placeholder="Paste token here..."
            style={s.textfield}
            placeholderTextColor="white"
            onChange={(e) => this.setState({token: e.nativeEvent.text})} />
          <TouchableNativeFeedback
            background={TouchableNativeFeedback.Ripple(colors.raspberry, false)}
            onPress={() => this.handleLogin()}>
            <View style={[s.buttonStyle, {backgroundColor: colors.darkRed}]}>
              <Text pointerEvents="none"
                style={s.buttonText}>
                Submit
              </Text>
            </View>
          </TouchableNativeFeedback>

      </Image>
    )
  }
}

LoginByTokenScreen.propTypes = {
  dispatch: PropTypes.func
}

export default connect()(LoginByTokenScreen)
