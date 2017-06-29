import PropTypes from 'prop-types'
import React from 'react'
import {View, Text, TouchableOpacity} from 'react-native'
import Avatar from '../../../components/Avatar'
import s from './styles'
import {createGhAvatarLink} from '../../../utils/links'

const UserTop = ({displayName, username, github, gravatarImageUrl, onAvatarPress}) => {
  const avatar = github ? createGhAvatarLink(username, 200) : gravatarImageUrl

  return (
    <View style={s.container}>
      <TouchableOpacity
        onPress={() => onAvatarPress(avatar)}>
        <View style={s.avatarWrapper}>
          <Avatar
            src={avatar}
            size={80} />
        </View>
      </TouchableOpacity>
      <View style={s.displayNameWapper}>
        <Text style={s.displayName}>
          {displayName}
        </Text>
        <Text style={s.username}>
          @{username}
        </Text>
      </View>
      {github && <View style={s.github}>
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
      </View>}
    </View>
  )
}

UserTop.propTypes = {
  displayName: PropTypes.string,
  username: PropTypes.string,
  github: PropTypes.object
}

export default UserTop
