import PropTypes from 'prop-types'
import React from 'react'
import {View, Text, TouchableOpacity} from 'react-native';
import s from './styles'

import Avatar from '../../../components/Avatar'
import Divider from '../../../components/Divider'
import Heading from '../../../components/Heading'
import Button from '../../../components/Button'
import ParsedText from '../../../components/ParsedText'

const RepoInfo = ({name, owner, description, open_issues_count: openIssuesCount, subscribers_count: subscribersCount,
  stargazers_count: stargazersCount, html_url, handleUrlPress, onStatItemPress, onAvatarPress}) => {
  return (
    <View style={s.container}>
      <View style={s.header}>
        <TouchableOpacity
          onPress={() => onAvatarPress(owner.avatar_url, name)}>
          <Avatar
            src={owner.avatar_url}
            size={50} />
        </TouchableOpacity>
        <View style={s.headerTextContainer}>
          <Text style={s.name}>{name}</Text>
          <Text style={s.owner}>by {owner.login}</Text>
        </View>
    </View>
    <Divider />
    {!!description && (
      <View style={s.descriptionBlock}>
        <Heading
          text="Description" />
        <View style={s.itemContainer}>
          <ParsedText
            text={description}
            handleUrlPress={handleUrlPress} />
        </View>
        <Divider />
      </View>
    )}
    <Heading
      text="Statistics" />
    <View style={s.itemContainer}>
      <View style={s.statContainer}>
        <Button
          style={s.button}
          onPress={() => onStatItemPress(html_url, 'issues')}>
          <View style={s.statItemContainer}>
            <Text style={s.statTop}>{openIssuesCount}</Text>
            <Text style={s.statBotoom}>issues</Text>
          </View>
        </Button>
        <Button
          style={s.button}
          onPress={() => onStatItemPress(html_url, 'watchers')}>
          <View style={s.statItemContainer}>
            <Text style={s.statTop}>{subscribersCount}</Text>
            <Text style={s.statBotoom}>watchers</Text>
          </View>
        </Button>
        <Button
          style={s.button}
          onPress={() => onStatItemPress(html_url, 'stargazers')}>
          <View style={s.statItemContainer}>
            <Text style={s.statTop}>{stargazersCount}</Text>
            <Text style={s.statBotoom}>stars</Text>
          </View>
        </Button>
      </View>
    </View>
    <Divider />
  </View>
  )
}

RepoInfo.propTypes = {
  name: PropTypes.string,
  owner: PropTypes.object,
  description: PropTypes.string,
  open_issues_count: PropTypes.number,
  stargazers_count: PropTypes.number,
  watchers_count: PropTypes.number,
  subscribers_count: PropTypes.number,
  html_url: PropTypes.string,
  handleUrlPress: PropTypes.func,
  onStatItemPress: PropTypes.func,
  onAvatarPress: PropTypes.func
}

export default RepoInfo
