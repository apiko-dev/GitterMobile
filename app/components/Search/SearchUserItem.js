import React, {
  PropTypes,
  View,
  Text,
  TouchableNativeFeedback
} from 'react-native'
import s from '../../styles/screens/Home/HomeRoomItemStyles'
import Avatar from '../Avatar'

const SearchUserItem = ({id, username, displayName, avatarUrlMedium, onPress}) => {
  return (
    <TouchableNativeFeedback
      onPress={() => onPress(id, username)}
      background={TouchableNativeFeedback.Ripple('#ECECEC', false)}>
      <View style={s.container}>
        <Avatar
          src={avatarUrlMedium}
          size={50} />

        <View style={s.infoContainer}>
          <Text style={s.name}>{displayName}</Text>
          <Text style={s.userCount}>@{username}</Text>
        </View>
      </View>
    </TouchableNativeFeedback>

  )
}

SearchUserItem.propTypes = {
  displayName: PropTypes.string,
  username: PropTypes.string,
  id: PropTypes.string,
  avatarUrlMedium: PropTypes.string,
  onPress: PropTypes.func
}

export default SearchUserItem
