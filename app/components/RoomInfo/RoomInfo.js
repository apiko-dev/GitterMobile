import React, {
  PropTypes,
  View,
  Text
} from 'react-native'
import s from '../../styles/screens/RoomInfo/RoomInfoStyles'

import Avatar from '../Avatar'
import Divider from '../Divider'

const RoomInfo = ({name, owner, description, open_issues_count, stargazers_count, watchers_count}) => {
  return (
    <View style={s.container}>
      <View style={s.header}>
        <Avatar
          src={owner.avatar_url}
          size={60} />
        <View style={s.headerTextContainer}>
          <Text style={s.name}>{name}</Text>
          <Text style={s.owner}>by {owner.login}</Text>
        </View>
    </View>
    <Divider />
    <View style={s.itemContainer}>
      <Text style={s.description}>{description}</Text>
    </View>
    <Divider />
    <View style={s.itemContainer}>
      <View style={s.statContainer}>
        <View style={s.statItemContainer}>
          <Text style={s.statTop}>{open_issues_count}</Text>
          <Text style={s.statBotoom}>issues</Text>
        </View>
        <View style={s.statItemContainer}>
          <Text style={s.statTop}>{stargazers_count}</Text>
          <Text style={s.statBotoom}>watchers</Text>
        </View>
        <View style={s.statItemContainer}>
          <Text style={s.statTop}>{watchers_count}</Text>
          <Text style={s.statBotoom}>star</Text>
        </View>
      </View>
    </View>
  </View>
  )
}

RoomInfo.propTypes = {
  name: PropTypes.string,
  owner: PropTypes.object,
  description: PropTypes.string,
  open_issues_count: PropTypes.number,
  stargazers_count: PropTypes.number,
  watchers_count: PropTypes.number
}

export default RoomInfo
