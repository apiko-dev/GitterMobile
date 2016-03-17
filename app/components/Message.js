import React, {
  Component,
  PropTypes,
  TouchableNativeFeedback,
  TouchableOpacity,
  Linking,
  View,
  Text
} from 'react-native'
import s from '../styles/MessageStyles'
import {connect} from 'react-redux'
import _ from 'lodash'
import moment from 'moment'
import ParsedText from './ParsedText'

import Avatar from './Avatar'
import StatusMessage from './StatusMessage'

class Message extends Component {
  constructor(props) {
    super(props)

    this.onMessagePress = this.onMessagePress.bind(this)
    this.renderMessageText = this.renderMessageText.bind(this)
    this.renderDate = this.renderDate.bind(this)
  }

  shouldComponentUpdate(nextProps) {
    if (!_.isEqual(this.props, nextProps)) {
      return true
    } else {
      return false
    }
  }

  onMessagePress() {
    const {onResendingMessage, text, rowId} = this.props
    if (!!this.props.failed && this.props.failed === true) {
      onResendingMessage(rowId, text)
    }
  }

  onLongPress() {
    const {id, rowId, onLongPress} = this.props
    onLongPress(rowId, id)
  }

  handleUrlPress(url) {
    Linking.openURL(url)
  }

  renderDate() {
    const {sent} = this.props

    if (sent === 'sending...' || sent === 'failed') {
      return sent
    }

    const now = moment()
    const date = moment(sent)
    if (now.year() > date.year()) {
      return date.format('YYYY MMM D HH:mm')
    }

    if (now.diff(date, 'hours') > 24) {
      return date.format('MMM D HH:mm')
    }

    return date.format('HH:mm')
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
    const {fromUser, sending, failed, readBy, isCollapsed,
      text, status, onUsernamePress, onUserAvatarPress} = this.props
    const opacity = sending === true ? 0.4 : 1

    let backgroundColor
    if (failed === true) {
      backgroundColor = 'rgba(255, 0, 0, 0.2)'
    } else if (readBy === 0) {
      backgroundColor = 'rgba(200, 200, 200, 0.2)'
    } else {
      backgroundColor = 'transparent'
    }

    if (!!status) {
      return (
        <StatusMessage
          text={text}
          onLongPress={this.onLongPress.bind(this)}
          onPress={this.onMessagePress.bind(this)}
          handleUrlPress={this.handleUrlPress.bind(this)}
          backgroundColor={backgroundColor} />
      )
    }

    if (isCollapsed) {
      return (
        <TouchableNativeFeedback
          onPress={() => this.onMessagePress()}
          onLongPress={() => this.onLongPress()}>
          <View style={[s.container, {opacity, backgroundColor}]}>
            <View style={{
              width: 30
            }} />
            <View style={s.content}>
              <View style={s.bottom}>
                {this.renderMessageText()}
              </View>
            </View>
          </View>
        </TouchableNativeFeedback>
      )
    }

    return (
      <TouchableNativeFeedback
        onPress={() => this.onMessagePress()}
        onLongPress={() => this.onLongPress()}>
        <View style={[s.container, {opacity, backgroundColor}]}>
          <TouchableOpacity
            onPress={() => onUserAvatarPress(fromUser.id)}>
              <Avatar src={fromUser.avatarUrlSmall} size={30} />
          </TouchableOpacity>
          <View style={s.content}>
            <View style={s.top}>
              <Text
                style={s.username}
                onPress={() => onUsernamePress(fromUser.username)}>{fromUser.username}</Text>
              <Text style={s.date}>{this.renderDate()}</Text>
            </View>
            <View style={s.bottom}>
              {this.renderMessageText()}
            </View>
          </View>
        </View>
      </TouchableNativeFeedback>
    )
  }
}

Message.defaultProps = {
  sending: false,
  failed: false
}

Message.propTypes = {
  id: PropTypes.string,
  rowId: PropTypes.number,
  text: PropTypes.string,
  sent: PropTypes.string,
  fromUser: PropTypes.object,
  readBy: PropTypes.number,
  sending: PropTypes.bool,
  failed: PropTypes.bool,
  dispatch: PropTypes.func,
  onResendingMessage: PropTypes.func,
  onLongPress: PropTypes.func,
  onUsernamePress: PropTypes.func,
  onUserAvatarPress: PropTypes.func,
  username: PropTypes.string,
  isCollapsed: PropTypes.bool,
  status: PropTypes.bool
}

function mapStateToProps(state) {
  const {username} = state.viewer.user
  return {
    username
  }
}

export default connect(mapStateToProps)(Message)
