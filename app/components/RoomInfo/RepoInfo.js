import React, {
  PropTypes,
  View,
  Text
} from 'react-native'
import s from '../../styles/screens/RoomInfo/RepoInfoStyles'

import Avatar from '../Avatar'
import Divider from '../Divider'
import Heading from '../Heading'
import Button from '../Button'
import ParsedText from '../ParsedText'

const RepoInfo = ({name, owner, description, open_issues_count,
  stargazers_count, watchers_count, html_url, handleUrlPress, onStatItemPress}) => {
  return (
    <View style={s.container}>
      <View style={s.header}>
        <Avatar
          src={owner.avatar_url}
          size={50} />
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
          styles={s.button}
          onPress={() => onStatItemPress(html_url, 'issues')}>
          <View style={s.statItemContainer}>
            <Text style={s.statTop}>{open_issues_count}</Text>
            <Text style={s.statBotoom}>issues</Text>
          </View>
        </Button>
        <Button
          styles={s.button}
          onPress={() => onStatItemPress(html_url, 'watchers')}>
          <View style={s.statItemContainer}>
            <Text style={s.statTop}>{watchers_count}</Text>
            <Text style={s.statBotoom}>watchers</Text>
          </View>
        </Button>
        <Button
          styles={s.button}
          onPress={() => onStatItemPress(html_url, 'stargazers')}>
          <View style={s.statItemContainer}>
            <Text style={s.statTop}>{stargazers_count}</Text>
            <Text style={s.statBotoom}>star</Text>
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
  html_url: PropTypes.string,
  handleUrlPress: PropTypes.func,
  onStatItemPress: PropTypes.func
}

export default RepoInfo
