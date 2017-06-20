import PropTypes from 'prop-types'
import React from 'react'
import {View, Text} from 'react-native';

const Heading = ({text, color, styles}) => (
  <View style={{
    padding: 16
  }}>
    <Text style={{
      fontWeight: 'bold',
      color
    }}>
      {text}
    </Text>
  </View>
)

Heading.defaultProps = {
  color: '#E20354'
}

Heading.propTypes = {
  text: PropTypes.string.isRequired,
  color: PropTypes.string,
  styles: PropTypes.any
}

export default Heading
