import React, {
  Component,
  PropTypes,
  Text,
  View
} from 'react-native'
import s from '../styles/LoginWelcomeStyles'

export default class LoginWelcome extends Component {
  render() {
    return (
      <View style={s.container}>
        <Text style={s.welcome}>
          Login welcome.
        </Text>
      </View>
    )
  }
}

LoginWelcome.propTypes = {

}
