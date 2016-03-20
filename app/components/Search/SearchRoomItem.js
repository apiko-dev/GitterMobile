import React, {
  PropTypes,
  View,
  Text,
  TouchableNativeFeedback
} from 'react-native'
import s from '../../styles/screens/Home/HomeRoomItemStyles'
// import {THEMES} from '../constants'
// const {colors} = THEMES.gitterDefault
import Avatar from '../Avatar'
import {createGhAvatarLink} from '../../utils/links'


const SearchRoomItem = ({id, name, userCount, oneToOne, onPress, exists, room, ...props}) => {
  const src = oneToOne
    ? createGhAvatarLink(props.user.username, 200)
    : createGhAvatarLink(name.split('/')[0], 200)

  const roomId = !!exists && exists === true && !!room ? room.id : id
  return (
    <TouchableNativeFeedback
      onPress={() => onPress(roomId, exists)}
      background={TouchableNativeFeedback.Ripple('#ECECEC', false)}>
      <View style={s.container}>
        <Avatar
          src={src}
          size={50} />

        <View style={s.infoContainer}>
          <Text style={s.name}>{name}</Text>
          <Text style={s.userCount}>{userCount} people</Text>
        </View>
      </View>
    </TouchableNativeFeedback>

  )
}

SearchRoomItem.defaultProps = {
  exists: true
}

SearchRoomItem.propTypes = {
  name: PropTypes.string.isRequired,
  userCount: PropTypes.number.isRequired,
  id: PropTypes.string.isRequired,
  user: PropTypes.object,
  onPress: PropTypes.func,
  exists: PropTypes.bool,
  room: PropTypes.object
}

export default SearchRoomItem
