import React, {PropTypes} from 'react';
import {ActivityIndicator, View} from 'react-native';
import {THEMES} from '../../constants'
const {colors} = THEMES.gitterDefault

const Loading = ({size, height, color}) => {
  return (
    <View style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      height
    }}>
      <View
        style={{height, width: height}}>
        <ActivityIndicator
          animating
          size={size}
          color={color || colors.raspberry}/>
      </View>
    </View>
  )
}

Loading.propTypes = {
  size: PropTypes.string,
  height: PropTypes.number,
  color: PropTypes.string
}

Loading.defaultProps = {
  size: 'large',
  height: 50
}

export default Loading
