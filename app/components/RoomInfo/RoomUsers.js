import React, {
  PropTypes,
  View,
  Text,
  TouchableOpacity
} from 'react-native'
import s from '../../styles/screens/RoomInfo/RoomUserStyles'

import Avatar from '../Avatar'
import Heading from '../Heading'
import Button from '../Button'

const RoomUsers = ({ids, entities, onPress, userCount}) => {
  return (
    <View style={s.container}>
      <Heading
        text={`People (${userCount})`} />
      <View style={s.usersContainer}>
        {ids.map(id => (
          <TouchableOpacity
            onPress={() => onPress(id, entities[id].username)}
            id={id}>
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
      <View style={s.buttonsGroup}>
        <Button
          onPress={() => {}}
          styles={[s.button, s.primaryButton]}>
          <Text>Add</Text>
        </Button>
        <Button
          onPress={() => {}}
          styles={s.button}>
          <Text>See all</Text>
        </Button>
      </View>
    </View>
  )
}

RoomUsers.propTypes = {
  ids: PropTypes.array,
  entities: PropTypes.object,
  onPress: PropTypes.func,
  userCount: PropTypes.number
}

export default RoomUsers
