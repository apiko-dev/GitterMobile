import PropTypes from 'prop-types'
import React from 'react'
import {View, Text} from 'react-native';
import Button from '../../../components/Button'
import s from '../../Home/HomeRoomItem/styles'
// import {THEMES} from '../constants'
// const {colors} = THEMES.gitterDefault
import Avatar from '../../../components/Avatar'
import {createGhAvatarLink} from '../../../utils/links'


const SearchRoomItem = ({id, name, userCount, oneToOne, onPress, exists, room, ...props}) => {
  const src = oneToOne
    ? createGhAvatarLink(props.user.username, 200)
    : createGhAvatarLink(name.split('/')[0], 200)

  const roomId = !!exists && exists === true && !!room ? room.id : id
  return (
    <Button
      style={s.container}
      onPress={() => onPress(roomId, exists)}
      rippleColor="#ECECEC">
      <Avatar
        src={src}
        size={50} />

      <View style={s.infoContainer}>
        <Text style={s.name}>{name}</Text>
        <Text style={s.userCount}>{userCount} people</Text>
      </View>
    </Button>

  )
}

SearchRoomItem.defaultProps = {
  exists: true
}

SearchRoomItem.propTypes = {
  name: PropTypes.string.isRequired,
  userCount: PropTypes.number.isRequired,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  user: PropTypes.object,
  onPress: PropTypes.func,
  exists: PropTypes.bool,
  room: PropTypes.object
}

export default SearchRoomItem
