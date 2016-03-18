import React, {
  PropTypes,
  ProgressBarAndroid,
  View
} from 'react-native'
import {THEMES} from '../constants'
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
        <ProgressBarAndroid
          styleAttr={size}
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
  size: 'LargeInverse',
  height: 50
}

export default Loading
