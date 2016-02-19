import React, {
  PropTypes,
  TouchableHighlight,
  View,
  Text
} from 'react-native'
import Avatar from './Avatar'
import UnreadBadge from './UnreadBadge'
import s from '../styles/ChannelListItemStyles'
import {createGhAvatarLink} from '../utils/links'
import {THEMES} from '../constants'
const {colors} = THEMES.gitterDefault

const ChannelListItem = ({id, name, oneToOne, user, activeRoom, onRoomPress, unreadItems, mentions, lurk}) => {
  const src = oneToOne
    ? createGhAvatarLink(user.username, 200)
    : createGhAvatarLink(name.split('/')[0], 200)

  const itemStyles = activeRoom === id
    ? {backgroundColor: colors.raspberry, color: colors.white, elevation: 2}
    : {backgroundColor: colors.white, elevation: 0}

  return (
    <TouchableHighlight
      onPress={onRoomPress.bind(this, id)}
      key={id}>
      <View style={[s.container,
        { backgroundColor: itemStyles.backgroundColor,
          elevation: itemStyles.elevation}]}
        key={id}>

        <Avatar
          src={src}
          size={30} />

        <View style={s.headingContainer}>
          <Text style={[s.heading, {color: itemStyles.color}]}>{name}</Text>
        </View>

        {(!!unreadItems || !!mentions || !!lurk) &&
          <UnreadBadge
            unreadItems={unreadItems}
            mentions={mentions}
            lurk={lurk} />}
      </View>
    </TouchableHighlight>
  )
}

ChannelListItem.propTypes = {
  // name: PropTypes.string,
  // items: PropTypes.array
}

export default ChannelListItem
