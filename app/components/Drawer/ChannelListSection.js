import React, {PropTypes, View, Text} from 'react-native'
import s from '../../styles/screens/Drawer/ChannelListSectionStyles'
import ChannelListItem from './ChannelListItem'
import Heading from '../Heading'

const ChannelListSection = ({name, items, onRoomPress, activeRoom, onLongRoomPress}) => {
  return (
    <View>
      <Heading text={name} styles={s.heading}/>
      <View style={s.itemSection}>
        {items && items.map(item => (
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
  onLongRoomPress: PropTypes.func
}

export default ChannelListSection
