import React, {
  PropTypes,
  TouchableNativeFeedback,
  View,
  Text
} from 'react-native'
import s from '../styles/components/FailedToLoadStyles'

const FailedToLoad = ({onRetry, message}) => {
  return (
    <View style={s.container}>
      <Text style={s.heading}>
        {message}
      </Text>
      <TouchableNativeFeedback
        onPress={() => onRetry()}>
        <View style={s.button}>
          <Text>Retry</Text>
        </View>
      </TouchableNativeFeedback>
    </View>
  )
}

FailedToLoad.propTypes = {
  onRetry: PropTypes.func,
  message: PropTypes.string
}

export default FailedToLoad
