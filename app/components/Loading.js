import React, {
  PropTypes,
  ProgressBarAndroid,
  View
} from 'react-native'

const Loading = ({size, height, color}) => {
  return (
    <View style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      height
    }}>
      <ProgressBarAndroid
        styleAttr={size}
        color={color}/>
    </View>
  )
}

Loading.propTypes = {
  size: PropTypes.string,
  height: PropTypes.number,
  color: PropTypes.string
}

Loading.defaultProps = {
  size: 'LargeInverse'
}

export default Loading
