import PropTypes from 'prop-types'
import React from 'react'
import {View, Text} from 'react-native';
import Button from '../../../components/Button'
import s from './styles'

import Avatar from '../../../components/Avatar'
import {createGhAvatarLink} from '../../../utils/links'

const HomeRoomItem = ({id, name, userCount, oneToOne, onPress, ...props}) => {
  const src = oneToOne
    ? createGhAvatarLink(props.user.username, 200)
    : createGhAvatarLink(name.split('/')[0], 200)
  return (
    <Button
      key={id}
      onPress={() => onPress(id)}
      style={s.container}>
      <Avatar
        src={src}
        size={50} />
      <View style={s.infoContainer}>
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          style={s.name}>
          {name}
        </Text>
        <Text style={s.userCount}>{userCount} people</Text>
      </View>
    </Button>

  )
}

HomeRoomItem.propTypes = {
  name: PropTypes.string.isRequired,
  userCount: PropTypes.number.isRequired,
  id: PropTypes.string.isRequired,
  user: PropTypes.object,
  onPress: PropTypes.func
}

export default HomeRoomItem
