import PropTypes from 'prop-types'
import React from 'react'
import {Text} from 'react-native';
import Button from '../../../components/Button'
import s from './styles'

const JoinRoomField = ({onPress}) => {
  return (
    <Button
      style={s.container}
      onPress={() => onPress()}>
      <Text style={s.text}>
        JOIN ROOM
      </Text>
    </Button>
  )
}

JoinRoomField.propTypes = {
  onPress: PropTypes.func
}

export default JoinRoomField
