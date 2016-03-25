import React, {
  PropTypes,
  View,
  Text
} from 'react-native'

const Heading = ({text, color, styles}) => {
  return (
    <View style={[
      {
        height: 24,
        padding: 16
      },
      styles
    ]}>
      <Text style={{
        fontWeight: 'bold',
        color
      }}>
        {text}
      </Text>
    </View>
  )
}

Heading.defaultProps = {
  color: 'black'
}

Heading.propTypes = {
  text: PropTypes.string.isRequired,
  color: PropTypes.string,
  styles: PropTypes.object
}

export default Heading
