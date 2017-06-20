import PropTypes from 'prop-types'
import React from 'react'
import {View, Text, TouchableOpacity} from 'react-native';
import s from './styles'

import Avatar from '../../../components/Avatar'
import Heading from '../../../components/Heading'
import Button from '../../../components/Button'

const RoomUsers = ({ids, entities, onPress, userCount, onAllUsersPress, onAddPress, oneToOne}) => {
  const displayUserHeader = oneToOne === true ? 'People' : `People (${userCount})`
  let content = []

  if (ids.length >= 30) {
    for (let i = 0; i < 30; i++) {
      const id = ids[i]
      content.push(
        <TouchableOpacity
          onPress={() => onPress(id, entities[id].username)}
          key={id}>
          <View
            key={id}
            style={s.itemContainer}>
            <Avatar
              src={entities[id].avatarUrlSmall}
              size={40} />
          </View>
        </TouchableOpacity>
      )
    }
  } else {
    content = ids.map(id => (
      <TouchableOpacity
        onPress={() => onPress(id, entities[id].username)}
        key={id}>
        <View
          key={id}
          style={s.itemContainer}>
          <Avatar
            src={entities[id].avatarUrlSmall}
            size={40} />
        </View>
      </TouchableOpacity>
    ))
  }
  return (
    <View style={s.container}>
      <Heading
        text={displayUserHeader} />
      <View style={s.usersContainer}>
        {content}
      </View>
      {!oneToOne && (
        <View style={s.buttonsGroup}>
          <Button
            onPress={() => onAddPress()}
            style={[s.button, s.primaryButton]}>
            <Text>Add</Text>
          </Button>
          <Button
            onPress={() => onAllUsersPress()}
            style={s.button}>
            <Text>See all</Text>
          </Button>
        </View>
    )}
    </View>
  )
}

RoomUsers.propTypes = {
  ids: PropTypes.array,
  entities: PropTypes.object,
  onPress: PropTypes.func,
  userCount: PropTypes.number,
  onAllUsersPress: PropTypes.func,
  oneToOne: PropTypes.bool,
  onAddPress: PropTypes.func
}

export default RoomUsers
