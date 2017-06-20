import PropTypes from 'prop-types'
import React, { Component } from 'react'
import {TouchableOpacity, Linking, View, Text} from 'react-native';
import {connect} from 'react-redux'
import _ from 'lodash'
import moment from 'moment'
import Icon from 'react-native-vector-icons/MaterialIcons'
import s from './styles'

import ParsedText from '../../../components/ParsedText'
import Avatar from '../../../components/Avatar'
import StatusMessage from '../StatusMessage'
import Button from '../../../components/Button'

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
    const {id, onPress, text, rowId} = this.props
    const failed = !!this.props.failed && this.props.failed === true
    onPress(id, rowId, text, failed)
  }

  onLongPress() {
    const {id, onLongPress} = this.props
    onLongPress(id)
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
    const {fromUser, sending, failed, readBy, isCollapsed, unread, username,
      text, status, onUsernamePress, onUserAvatarPress, sent, onLayout} = this.props
    const opacity = sending === true ? 0.4 : 1

    let backgroundColor

    if (failed === true) {
      backgroundColor = 'rgba(255, 0, 0, 0.2)'
    } else if (fromUser.username !== username && unread === true) {
      backgroundColor = 'rgba(213,245,226,.8)'
    } else {
      backgroundColor = 'transparent'
    }

    const readStatusOpacity = readBy === 0 || ['sending...', 'failed'].indexOf(sent) !== -1 ? 0 : 0.1

    if (!!status) {
      return (
        <StatusMessage
          onLayout={onLayout}
          text={text}
          onLongPress={this.onLongPress.bind(this)}
          onPress={this.onMessagePress.bind(this)}
          handleUrlPress={this.handleUrlPress.bind(this)}
          backgroundColor={backgroundColor}
          opacity={readStatusOpacity} />
      )
    }

    if (isCollapsed) {
      return (
        <Button
          style={[s.container, {opacity, backgroundColor}]}
          onPress={() => this.onMessagePress()}
          onLayout={e => onLayout(e)}
          onLongPress={() => this.onLongPress()}>
          <View style={{
            width: 30
          }} />
          <View style={s.content}>
            <View style={s.bottom}>
              {this.renderMessageText()}
            </View>
          </View>
          <View style={s.readStatus}>
            <Icon
              style={{opacity: readStatusOpacity}}
              name="done"
              color="black"
              size={15} />
          </View>
        </Button>
      )
    }

    return (
      <View
        onLayout={e => onLayout(e)}>
      <Button
        onPress={() => this.onMessagePress()}
        onLongPress={() => this.onLongPress()}
        style={[s.container, {opacity, backgroundColor}]}>
        <TouchableOpacity
          onPress={() => onUserAvatarPress(fromUser.id, fromUser.username)}>
          <Avatar src={fromUser.avatarUrlSmall} size={30} />
        </TouchableOpacity>
        <View style={s.content}>
          <View style={s.top}>
            <Text
              style={s.username}
              onPress={() => onUsernamePress(fromUser.username)}>{fromUser.username}</Text>
            <Text style={s.date}>
              {this.renderDate()}
            </Text>
          </View>
          <View style={s.bottom}>
            {this.renderMessageText()}
          </View>
        </View>
        <View style={s.readStatus}>
          <Icon
            style={{opacity: readStatusOpacity}}
            name="done"
            color="black"
            size={15} />
        </View>
      </Button>
    </View>
    )
  }
}

const noop = () => {}

Message.defaultProps = {
  sending: false,
  failed: false,
  onLayout: noop,
  onLongPress: noop,
  onPress: noop,
  onUsernamePress: noop,
  onUserAvatarPress: noop
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
  onPress: PropTypes.func,
  onLongPress: PropTypes.func,
  onUsernamePress: PropTypes.func,
  onUserAvatarPress: PropTypes.func,
  username: PropTypes.string,
  isCollapsed: PropTypes.bool,
  status: PropTypes.bool,
  onLayout: PropTypes.func,
  unread: PropTypes.bool
}

function mapStateToProps(state) {
  const {username} = state.viewer.user
  return {
    username
  }
}

export default connect(mapStateToProps)(Message)
