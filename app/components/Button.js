import React, {
  PropTypes,
  TouchableNativeFeedback,
  View
} from 'react-native'
import s from '../styles/components/ButtonStyles'

const Button = ({onPress, children, styles}) => {
  return (
    <TouchableNativeFeedback
      onPress={() => onPress()}>
      <View style={[s.button, styles]}>
        {children}
      </View>
    </TouchableNativeFeedback>
  )
}

Button.propTypes = {
  onPress: PropTypes.func,
  children: React.PropTypes.element.isRequired,
  styles: PropTypes.object
}

export default Button
