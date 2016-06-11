import React, {
  PropTypes,
  View,
  Text
} from 'react-native'
import s from '../../styles/screens/Settings/TextItem'

import Button from '../Button'

const TextITem = ({
  onPress,
  text
}) => (
  <Button
    onPress={onPress}
    styles={s.button}>
    <View style={s.container}>
      <Text style={s.text}>{text}</Text>
    </View>
  </Button>
)

TextITem.propTypes = {
  onPress: PropTypes.func,
  text: PropTypes.string,
  icon: PropTypes.string
}

export default TextITem
