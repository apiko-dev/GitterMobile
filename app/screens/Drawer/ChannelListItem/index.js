import PropTypes from 'prop-types'
import React from 'react'
import {View, Text} from 'react-native';
import s from './styles'

import Avatar from '../../../components/Avatar'
import UnreadBadge from '../../../components/UnreadBadge'
import Button from '../../../components/Button'

import {createGhAvatarLink} from '../../../utils/links'
import {THEMES} from '../../../constants'
const {colors} = THEMES.gitterDefault

const ChannelListItem = ({
  id, name, oneToOne, user, activeRoom, onRoomPress,
  unreadItems, mentions, lurk, onLongRoomPress
}) => {
  const src = oneToOne
    ? createGhAvatarLink(user.username, 200)
    : createGhAvatarLink(name.split('/')[0], 200)

  const itemStyles = activeRoom === id
    ? {backgroundColor: colors.androidGray, color: colors.raspberry}
    : {backgroundColor: colors.white}

  return (
    <Button
      onPress={() => onRoomPress(id)}
      onLongPress={() => onLongRoomPress(id)}
      style={[s.container,
        {backgroundColor: itemStyles.backgroundColor}
      ]}
      key={id}>
      <View style={s.leftContainer}>
        <Avatar
          src={src}
          size={30} />

        <View style={s.headingContainer}>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={[s.heading, {color: itemStyles.color}]}>
            {name}
          </Text>
        </View>
        {(!!unreadItems || !!mentions || !!lurk) &&
          <UnreadBadge
          unreadItems={unreadItems}
          mentions={mentions}
          lurk={lurk} />}
      </View>

    </Button>
  )
}

ChannelListItem.propTypes = {
  // id: PropTypes.stings,
  onLongRoomPress: PropTypes.func,
  name: PropTypes.string,
  oneToOne: PropTypes.bool,
  user: PropTypes.object,
  activeRoom: PropTypes.string,
  onRoomPress: PropTypes.func,
  unreadItems: PropTypes.number,
  mentions: PropTypes.number,
  lurk: PropTypes.bool
}

export default ChannelListItem
