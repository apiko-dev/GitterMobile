import React, {
  Component,
  PropTypes,
  Text,
  Image
} from 'react-native'
import s from '../styles/LoginByTokenStyles'
import {MKButton, MKTextField} from 'react-native-material-kit'
import Link from './Link'

const Textfield = MKTextField.textfield()
  .withPlaceholder('Paste token here...')
  .withStyle(s.textfield)
  .withTextInputStyle({color: 'white'})
  .withTintColor('white')
  .withHighlightColor('white')
  .build();

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

          <Textfield
            value={this.state.token}
            onChangeText={(e) => this.setState({token: e})} />
          <MKButton
            style={s.buttonStyle}
            onPress={() => console.warn(this.state.token)}>
            <Text pointerEvents="none"
              style={s.buttonText}>
              Submit
            </Text>
          </MKButton>

      </Image>
    )
  }
}

LoginByToken.propTypes = {
  onSubmit: PropTypes.func
}
