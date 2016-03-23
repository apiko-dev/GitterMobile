import React, {
  PropTypes,
  Component,
  TouchableNativeFeedback,
  View,
  Text,
  Image
} from 'react-native'
import {connect} from 'react-redux'
import s from '../styles/screens/RoomInfo/RoomInfoScreenStyles'
import * as Navigation from '../modules/navigation'
import {THEMES} from '../constants'
const {colors} = THEMES.gitterDefault

class NoInternetScreen extends Component {
  constructor(props) {
    super(props)

  }

  render() {
    return (
      <Image style={s.container}
        source={require('../images/gitter-background.jpg')}>

        <Text style={s.logo}>
          No internet connection.
        </Text>

        <TouchableNativeFeedback
          background={TouchableNativeFeedback.Ripple(colors.raspberry, false)}
          onPress={() => this.handleRetry()}>
          <View style={[s.buttonStyle, {backgroundColor: colors.darkRed}]}>
            <Text pointerEvents="none"
              style={s.buttonText}>
              Retry
            </Text>
          </View>
        </TouchableNativeFeedback>
      </Image>
    )
  }
}

NoInternetScreen.propTypes = {
  dispatch: PropTypes.func,
  drawer: PropTypes.element,
  route: PropTypes.object
}

export default connect()(NoInternetScreen)
