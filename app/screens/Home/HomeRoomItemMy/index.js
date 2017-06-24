import PropTypes from 'prop-types'
import React from 'react'
import {View, Text} from 'react-native';
import Button from '../../../components/Button'
import UnreadBadge from '../../../components/UnreadBadge'
import s from './styles'
import Avatar from '../../../components/Avatar'

import {createGhAvatarLink} from '../../../utils/links'

const HomeRoomItemMy = ({
  id, name, oneToOne, user, onPress,
  unreadItems, mentions, lurk, userCount
}) => {
  const src = oneToOne
    ? createGhAvatarLink(user.username, 200)
    : createGhAvatarLink(name.split('/')[0], 200)

  return (
    <Button
      style={s.container}
      key={id}
      onPress={() => onPress(id)}>
      <Avatar
        src={src}
        size={50} />

      <View style={s.headingContainer}>
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          style={s.heading}>
          {name}
        </Text>
        <Text style={s.userCount}>{userCount} people</Text>
      </View>
      {(!!unreadItems || !!mentions || !!lurk) &&
        <View style={s.unread}>
        <UnreadBadge
        unreadItems={unreadItems}
        mentions={mentions}
        lurk={lurk} />
        </View>}

    </Button>
  )
}


HomeRoomItemMy.propTypes = {
  name: PropTypes.string.isRequired,
  userCount: PropTypes.number.isRequired,
  id: PropTypes.string.isRequired,
  user: PropTypes.object,
  onPress: PropTypes.func
}


export default HomeRoomItemMy
