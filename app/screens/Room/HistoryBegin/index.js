import PropTypes from 'prop-types'
import React from 'react'
import {View, Text} from 'react-native';
import s from './styles'

const HistoryBegin = () => {
  return (
    <View style={s.container}>
      <Text style={s.heading}>
        Welcome!
      </Text>
      <Text style={s.text}>
        This is the very beginning of this channel history.
      </Text>
    </View>
  )
}

HistoryBegin.propTypes = {

}

export default HistoryBegin
