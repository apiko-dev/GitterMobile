import React, {
  PropTypes,
  Image,
  View,
  Text
} from 'react-native'
import s from '../../styles/screens/RoomUserAdd/RoomUserItemStyles'

import Avatar from '../Avatar'
import Button from '../Button'

const RoomUserItem = ({onUserItemPress, id, username, displayName, avatarUrlSmall, onAddPress, noButton}) => {
  return (
    <Button
      onPress={() => onUserItemPress(id, username)}
      styles={s.button}>
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
          styles={s.addIcon}>
          <Image
            style={s.icon}
            source={require('image!ic_person_add_black_24dp')} />
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
