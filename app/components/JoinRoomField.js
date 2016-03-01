import React, {
  PropTypes,
  TouchableNativeFeedback,
  View,
  Text
} from 'react-native'
import s from '../styles/JoinRoomFieldStyles'

const JoinRoomField = () => {
  return (
    <TouchableNativeFeedback
      background={TouchableNativeFeedback.SelectableBackground()}
      onPress={() => console.log("JOIN")}>
      <View style={s.container}>
        <Text style={s.text}>
          Join room!
        </Text>
      </View>
    </TouchableNativeFeedback>
  )
}

JoinRoomField.propTypes = {

}

export default JoinRoomField
