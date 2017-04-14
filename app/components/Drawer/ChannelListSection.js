import React, {PropTypes} from 'react';
import {View, Text, Image} from 'react-native';
import s from '../../styles/screens/Drawer/ChannelListSectionStyles'
import ChannelListItem from './ChannelListItem'
import Heading from '../Heading'
import Button from '../Button'

const ChannelListSection = ({
  name,
  items,
  onRoomPress,
  activeRoom,
  onLongRoomPress,
  onToggleCollapsed,
  sectionsState
}) => {
  const image = sectionsState[name] ? require('../../images/icons/ic_expand_more_black_24dp.png') : require('../../images/icons/ic_expand_less_black_24dp.png')
  return (
    <View>
      <Button
        style={s.sectionHeader}
        onPress={() => onToggleCollapsed(name, sectionsState[name])}>
        <Heading text={name} styles={s.heading}/>
        <Image
          source={image}
          style={s.icon} />
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
