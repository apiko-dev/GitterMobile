import React, {
  PropTypes,
  View,
  TouchableOpacity
} from 'react-native'
import s from '../../styles/screens/RoomInfo/RoomUserStyles'

import Avatar from '../Avatar'
import Heading from '../Heading'

const RoomUsers = ({ids, entities, onPress}) => {
  return (
    <View style={s.container}>
      <Heading
        text="People" />
      <View style={s.usersContainer}>
        {ids.map(id => (
          <TouchableOpacity
            onPress={() => onPress(id, entities[id].username)}>
            <View
              key={id}
              style={s.itemContainer}>
              <Avatar
                src={entities[id].avatarUrlSmall}
                size={40} />
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  )
}

RoomUsers.propTypes = {
  ids: PropTypes.string,
  entities: PropTypes.object,
  onPress: PropTypes.func
}

export default RoomUsers
