import PropTypes from 'prop-types'
import React from 'react'
import {View, Text} from 'react-native';
import s from './styles'

import Avatar from '../../../components/Avatar'
import Button from '../../../components/Button'

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
