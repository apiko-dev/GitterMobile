import React, {
  PropTypes,
  View,
  TouchableOpacity
} from 'react-native'
import s from '../../styles/screens/Message/ReadBy'

import Avatar from '../Avatar'
import Heading from '../Heading'

const ReadBy = ({items, onAvatarPress}) => {
  return (
    <View style={s.container}>
      <Heading
        text="Read by" />
      <View style={s.usersContainer}>
        {items.map(item => (
          <TouchableOpacity
            onPress={() => onAvatarPress(item.id, item.username)}
            key={item.id}>
            <View
              key={item.id}
              style={s.itemContainer}>
              <Avatar
                src={item.avatarUrlSmall}
                size={40} />
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  )
}

ReadBy.propTypes = {
  items: PropTypes.array,
  onAvatarPress: PropTypes.func
}

export default ReadBy
