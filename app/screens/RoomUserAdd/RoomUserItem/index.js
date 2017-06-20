import PropTypes from 'prop-types'
import React from 'react'
import {View, Text} from 'react-native';
import s from './styles'
import Icon from 'react-native-vector-icons/MaterialIcons'

import Avatar from '../../../components/Avatar'
import Button from '../../../components/Button'

const RoomUserItem = ({onUserItemPress, id, username, displayName, avatarUrlSmall, onAddPress, noButton}) => {
  return (
    <Button
      key={id}
      onPress={() => onUserItemPress(id, username)}
      style={s.button}>
      <Avatar
        size={42}
        src={avatarUrlSmall} />
      <View style={s.userInfo}>
        <Text style={s.displayName}>{displayName}</Text>
        <Text style={s.username}>@{username}</Text>
      </View>
      {!noButton && (
        <Button
          onPress={() => onAddPress(username)}
          style={s.addIcon}>
          <Icon
            style={{opacity: 0.6}}
            name="person-add"
            color="black"
            size={30} />
        </Button>
      )}
    </Button>
  )
}

RoomUserItem.propTypes = {
  onUserItemPress: PropTypes.func,
  id: PropTypes.string,
  username: PropTypes.string,
  displayName: PropTypes.string,
  avatarUrlSmall: PropTypes.string,
  onAddPress: PropTypes.func,
  noButton: PropTypes.bool
}

export default RoomUserItem
