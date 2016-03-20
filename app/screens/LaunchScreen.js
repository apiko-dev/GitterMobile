import React, {
  Component,
  Text,
  Image
} from 'react-native'
import s from '../styles/screens/LaunchScreenStyles'


export default class LaunchScreen extends Component {
  render() {
    return (
      <Image style={s.container}
        source={require('../images/gitter-background.jpg')}>

        <Text style={s.logo}>
          Loading...
        </Text>
      </Image>
    )
  }
}
