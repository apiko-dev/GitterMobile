import React, {
  Component,
  PropTypes,
  TouchableOpacity,
  Linking,
  View,
  Text
} from 'react-native'
import s from '../../styles/screens/Room/MessageStyles'
import moment from 'moment'
import ParsedText from '../ParsedText'

import Avatar from '../Avatar'

class Message extends Component {
  constructor(props) {
    super(props)

    this.renderMessageText = this.renderMessageText.bind(this)
    this.renderDate = this.renderDate.bind(this)
  }

  handleUrlPress(url) {
    Linking.openURL(url)
  }

  renderDate() {
    const {sent} = this.props
    return moment(sent).format('YYYY MMM D HH:mm')
  }

  renderMessageText() {
    const {text, username} = this.props

    if (this.props.hasOwnProperty('editedAt') && !text) {
      return (
        <Text style={[s.text, s.deleted]}>
          This message was deleted
        </Text>
      )
    }
    return (
      <ParsedText
        text={text}
        username={username}
        handleUrlPress={this.handleUrlPress} />
    )
  }

  render() {
    const {fromUser, onAvatarPress} = this.props

    return (
      <View style={s.container}>
        <TouchableOpacity
          onPress={() => onAvatarPress(fromUser.id, fromUser.username)}>
          <Avatar src={fromUser.avatarUrlSmall} size={30} />
        </TouchableOpacity>
        <View style={s.content}>
          <View style={s.top}>
            <Text
              style={s.username}>
              {fromUser.username}
            </Text>
            <Text style={s.date}>
              {this.renderDate()}
            </Text>
          </View>
          <View style={s.bottom}>
            {this.renderMessageText()}
          </View>
        </View>
      </View>
    )
  }
}

Message.propTypes = {
  id: PropTypes.string,
  text: PropTypes.string,
  sent: PropTypes.string,
  fromUser: PropTypes.object,
  dispatch: PropTypes.func,
  onAvatarPress: PropTypes.func,
  username: PropTypes.string,
  status: PropTypes.bool
}

export default Message
