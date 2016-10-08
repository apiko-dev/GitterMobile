import React, {PropTypes} from 'react';
import {View, Text} from 'react-native';
import Button from '../Button'
import s from '../../styles/screens/Room/JoinRoomFieldStyles'

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
