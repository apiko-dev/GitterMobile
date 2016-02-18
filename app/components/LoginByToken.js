import React, {
  Component,
  PropTypes,
  TouchableNativeFeedback,
  TextInput,
  View,
  Text,
  Image
} from 'react-native'
import s from '../styles/LoginByTokenStyles'

import Link from './Link'
import {THEMES} from '../constants'
const {colors} = THEMES.gitterDefault

export default class LoginByToken extends Component {
  constructor(props) {
    super(props)
    this.state = {
      token: null
    }
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
            onChangeText={(e) => this.setState({token: e})} />
          <TouchableNativeFeedback
            background={TouchableNativeFeedback.Ripple(colors.raspberry, false)}
            onPress={() => this.props.onSubmit(this.state.token)}>
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

LoginByToken.propTypes = {
  onSubmit: PropTypes.func.isRequired
}
