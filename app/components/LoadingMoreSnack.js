import React, {
  View,
  Text
} from 'react-native'
import s from '../styles/RoomSnackStyles'

const LoadingMoreSnack = () => {
  return (
    <View style={[s.container, s.info]}>
      <Text style={s.text}>Loading...</Text>
    </View>
  )
}

export default LoadingMoreSnack
