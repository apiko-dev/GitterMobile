import React, {
  PropTypes,
  TouchableNativeFeedback,
  View,
  Text
} from 'react-native'
import s from '../../styles/screens/Room/JoinRoomFieldStyles'

const JoinRoomField = ({onPress}) => {
  return (
    <TouchableNativeFeedback
      background={TouchableNativeFeedback.SelectableBackground()}
      onPress={() => onPress()}>
      <View style={s.container}>
        <Text style={s.text}>
          Join room!
        </Text>
      </View>
    </TouchableNativeFeedback>
  )
}

JoinRoomField.propTypes = {
  onPress: PropTypes.func
}

export default JoinRoomField
