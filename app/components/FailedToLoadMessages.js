import React, {
  PropTypes,
  TouchableNativeFeedback,
  View,
  Text
} from 'react-native'
import s from '../styles/FailedToLoadMessagesStyles'

const FailedToLoadMessages = ({onPress}) => {
  return (
    <View style={s.container}>
      <Text style={s.heading}>
        Failed to load messages.
      </Text>
      <TouchableNativeFeedback
        onPress={() => onPress()}>
        <View style={s.button}>
          <Text>Retry</Text>
        </View>
      </TouchableNativeFeedback>
    </View>
  )
}

FailedToLoadMessages.propTypes = {
  onRetry: PropTypes.func
}

export default FailedToLoadMessages
