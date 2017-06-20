import PropTypes from 'prop-types'
import React from 'react'
import {View, Text} from 'react-native';
import Button from '../../../components/Button'
import s from '../../Home/HomeRoomItem/styles'
import Avatar from '../../../components/Avatar'

const SearchUserItem = ({id, username, displayName, avatarUrlMedium, onPress}) => {
  return (
    <Button
      onPress={() => onPress(id, username)}
      style={s.container}>
      <Avatar
        src={avatarUrlMedium}
        size={50} />

      <View style={s.infoContainer}>
        <Text style={s.name}>{displayName}</Text>
        <Text style={s.userCount}>@{username}</Text>
      </View>
    </Button>

  )
}

SearchUserItem.propTypes = {
  displayName: PropTypes.string,
  username: PropTypes.string,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  avatarUrlMedium: PropTypes.string,
  onPress: PropTypes.func
}

export default SearchUserItem
