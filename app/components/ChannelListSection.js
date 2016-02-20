import React, {PropTypes, View, Text} from 'react-native'
import s from '../styles/ChannelListSectionStyles'
import ChannelListItem from './ChannelListItem'

const ChannelListSection = ({name, items, onRoomPress, activeRoom}) => {
  return (
    <View>
      <View style={s.container}>
        <Text style={s.heading}>{name}</Text>
      </View>
      <View style={s.itemSection}>
        {items && items.map(item => <ChannelListItem key={item.id} {...item} activeRoom={activeRoom} onRoomPress={onRoomPress}/>)}
      </View>
    </View>
  )
}

ChannelListSection.propTypes = {
  name: PropTypes.string,
  items: PropTypes.array
}

export default ChannelListSection
