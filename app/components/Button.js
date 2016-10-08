import React, {Children, PropTypes} from 'react';
import {TouchableNativeFeedback, TouchableOpacity, View} from 'react-native';
import s from '../styles/components/ButtonStyles'
import DeviceInfo from 'react-native-device-info'
import {OLD_ANDROID_VERSIONS} from '../constants'

const noop = () => {}

const Button = ({
  onPress = noop,
  onLongPress = noop,
  onLayout = noop,
  children,
  rippleColor,
  style
}) => {
  const version = DeviceInfo.getSystemVersion()

  if (!!OLD_ANDROID_VERSIONS.find(oldVersion => oldVersion === version)) {
    return (
      <TouchableOpacity
        onLongPress={onLongPress}
        onLayout={onLayout}
        onPress={onPress}>
        <View style={style}>
          {Children.map(children, child => child)}
        </View>
      </TouchableOpacity>
    )
  } else {
    return (
      <TouchableNativeFeedback
        onLongPress={onLongPress}
        onLayout={onLayout}
        onPress={onPress}
        background={TouchableNativeFeedback.Ripple(rippleColor, false)}>
        <View style={style}>
          {Children.map(children, child => child)}
        </View>
      </TouchableNativeFeedback>
    )
  }
}

Button.defaultProps = {
  onPress: noop,
  onLongPress: noop,
  onLayout: noop,
  rippleColor: '#FFF',
  // style: s.button
}

Button.propTypes = {
  onPress: PropTypes.func,
  children: React.PropTypes.element.isRequired,
  style: PropTypes.oneOf([PropTypes.object, PropTypes.array]),
  onLongPress: PropTypes.func,
  onLayout: PropTypes.func,
  rippleColor: PropTypes.string
}

export default Button
