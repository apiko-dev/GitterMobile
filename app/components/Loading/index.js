import PropTypes from 'prop-types'
import React from 'react'
import {ActivityIndicator, View, Text} from 'react-native';
import {THEMES} from '../../constants'
const {colors} = THEMES.gitterDefault

const Loading = ({size, height, color, text}) => (
  <View style={{
    flex: height ? 0 : 1,
    justifyContent: 'center',
    alignItems: 'center',
    height
  }}>
    <ActivityIndicator
      animating
      size={size}
      color={color || colors.raspberry}/>
    {text && (
      <Text style={{
        fontSize: 18,
        backgroundColor: 'transparent',
        marginTop: 16,
        color: color || colors.raspberry
      }}>
        {text}
      </Text>
    )}
  </View>
)

Loading.propTypes = {
  size: PropTypes.string,
  height: PropTypes.number,
  color: PropTypes.string
}

Loading.defaultProps = {
  size: 'large'
}

export default Loading
