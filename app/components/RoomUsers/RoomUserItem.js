import React, {PropTypes} from 'react';
import {View, Text} from 'react-native';
import s from '../../styles/screens/RoomUsers/RoomUserItemStyles'

import Avatar from '../Avatar'
import Button from '../Button'

const RoomUserItem = ({onUserItemPress, id, username, displayName, avatarUrlSmall}) => {
  return (
    <Button
      onPress={() => onUserItemPress(id, username)}
      style={s.button}>
      <Avatar
        size={42}
        src={avatarUrlSmall} />
      <View style={s.userInfo}>
        <Text style={s.displayName}>{displayName}</Text>
        <Text style={s.username}>@{username}</Text>
      </View>
    </Button>
  )
}

RoomUserItem.propTypes = {
  onUserItemPress: PropTypes.func,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  username: PropTypes.string,
  displayName: PropTypes.string,
  avatarUrlSmall: PropTypes.string
}

export default RoomUserItem
