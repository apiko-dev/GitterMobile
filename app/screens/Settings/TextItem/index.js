import PropTypes from 'prop-types'
import React from 'react'
import {View, Text} from 'react-native';
import s from './styles'

import Button from '../../../components/Button'

const TextITem = ({
  onPress,
  text
}) => (
  <Button
    onPress={onPress}
    style={s.button}>
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
