import React, {PropTypes} from 'react';
import {View, Text} from 'react-native';
import Button from '../Button'
import s from '../../styles/screens/Home/HomeRoomItemStyles'
import s2 from '../../styles/screens/Home/HomeRoomItemMy'

import Avatar from '../Avatar'
import UnreadBadge from '../UnreadBadge'
import {createGhAvatarLink} from '../../utils/links'


export const HomeRoomItem = ({id, name, userCount, oneToOne, onPress, ...props}) => {
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
        <Text style={s.name}>{name}</Text>
        <Text style={s.userCount}>{userCount} people</Text>
      </View>
    </Button>

  )
}

export const HomeRoomItemMy = ({
  id, name, oneToOne, user, onPress,
  unreadItems, mentions, lurk, userCount
}) => {
  const src = oneToOne
    ? createGhAvatarLink(user.username, 200)
    : createGhAvatarLink(name.split('/')[0], 200)

  return (
    <Button
      style={s2.container}
      key={id}
      onPress={() => onPress(id)}>
      <Avatar
        src={src}
        size={50} />

      <View style={s2.headingContainer}>
        <Text style={s2.heading}>{name}</Text>
        <Text style={s2.userCount}>{userCount} people</Text>
      </View>

      {(!!unreadItems || !!mentions || !!lurk) &&
        <View style={s2.unread}>
          <UnreadBadge
            unreadItems={unreadItems}
            mentions={mentions}
            lurk={lurk} />
      </View>}
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
