import PropTypes from 'prop-types'
import React from 'react'
import {View} from 'react-native'
import s from './styles'
import ChannelListItem from '../ChannelListItem'
import Heading from '../../../components/Heading'
import Button from '../../../components/Button'
import Icon from 'react-native-vector-icons/MaterialIcons'

const ChannelListSection = ({
  name,
  items,
  onRoomPress,
  activeRoom,
  onLongRoomPress,
  onToggleCollapsed,
  sectionsState
}) => {
  const icon = sectionsState[name] ? 'expand-more' : 'expand-less'

  return (
    <View>
      <Button
        style={s.sectionHeader}
        onPress={() => onToggleCollapsed(name, sectionsState[name])}>
        <Heading text={name} styles={s.heading}/>
        <Icon
          name={icon}
          color="black"
          size={16} />
      </Button>
      <View style={s.itemSection}>
        {!sectionsState[name] && items && items.map(item => (
          <ChannelListItem
            key={item.id}
            {...item}
            activeRoom={activeRoom}
            onRoomPress={onRoomPress}
            onLongRoomPress={onLongRoomPress} />
        ))}
      </View>
    </View>
  )
}


ChannelListSection.propTypes = {
  name: PropTypes.string,
  items: PropTypes.array,
  onRoomPress: PropTypes.func,
  activeRoom: PropTypes.string,
  onLongRoomPress: PropTypes.func,
  collapsed: PropTypes.bool,
  sectionsState: PropTypes.object
}

export default ChannelListSection
