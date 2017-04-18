import React, {PropTypes} from 'react';
import {View, Text} from 'react-native';
import Avatar from '../../../components/Avatar'
import s from './styles'
import {createGhAvatarLink} from '../../../utils/links'

const UserTop = ({displayName, username, github}) => {
  return (
    <View style={s.container}>
      <View style={s.avatarWrapper}>
        <Avatar
          src={createGhAvatarLink(username, 200)}
          size={80} />
      </View>
      <View style={s.displayNameWapper}>
        <Text style={s.displayName}>
          {displayName}
        </Text>
        <Text style={s.username}>
          @{username}
        </Text>
      </View>
      <View style={s.github}>
        <View style={s.githubItem}>
          <Text style={s.bold}>{github.followers}</Text>
          <Text style={s.githubItemText}>followers</Text>
        </View>
        <View style={s.githubItem}>
          <Text style={s.bold}>{github.public_repos}</Text>
          <Text style={s.githubItemText}>repos</Text>
        </View>
        <View style={s.githubItem}>
          <Text style={s.bold}>{github.following}</Text>
          <Text style={s.githubItemText}>following</Text>
        </View>
      </View>
    </View>
  )
}

UserTop.propTypes = {
  displayName: PropTypes.string,
  username: PropTypes.string,
  github: PropTypes.object
}

export default UserTop
