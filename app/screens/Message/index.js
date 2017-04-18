import React, {Component, PropTypes} from 'react';
import {View, ScrollView} from 'react-native';
import {connect} from 'react-redux'
import s from './styles'
import navigationStyles from '../../styles/common/navigationStyles'

import {subscribeToReadBy, unsubscribeFromReadBy} from '../../modules/realtime'

import ReadBy from './ReadBy'
import Msg from './Message'

class Message extends Component {
  constructor(props) {
    super(props)

    this.renderMessage = this.renderMessage.bind(this)
    // this.renderReadBy = this.renderReadBy.bind(this)
    this.handleAvatarPress = this.handleAvatarPress.bind(this)

    this.props.navigator.setTitle({title: 'Message'})
  }

  componentWillMount() {
    const {dispatch, roomId, messageId} = this.props
    dispatch(subscribeToReadBy(roomId, messageId))
  }

  componentWillUnmount() {
    const {dispatch} = this.props
    dispatch(unsubscribeFromReadBy())
  }

  handleAvatarPress(id, username) {
    const {navigator} = this.props
    navigator.showModal({screen: 'gm.User', passProps: {userId: id, username}})
  }

  renderMessage() {
    const {messages, messageId, fromSearch, viewer, roomMessagesResult} = this.props
    const message = fromSearch
      ? roomMessagesResult.find(item => item.id === messageId)
      : messages[messageId]

    return (
      <Msg
        username={viewer.username}
        onAvatarPress={this.handleAvatarPress}
        {...message} />
    )
  }

  renderReadBy() {
    const {readBy, messageId} = this.props
    if (!readBy[messageId]) {
      return null
    }

    return (
      <ReadBy
        onAvatarPress={this.handleAvatarPress}
        items={readBy[messageId]} />
    )
  }

  render() {
    return (
      <View style={s.container}>
        <ScrollView>
          {this.renderMessage()}
          {this.renderReadBy()}
        </ScrollView>
      </View>
    )
  }
}

Message.propTypes = {
  dispatch: PropTypes.func,
  route: PropTypes.object,
  messages: PropTypes.object,
  readBy: PropTypes.object,
  viewer: PropTypes.object,
  roomMessagesResult: PropTypes.array
}

Message.navigatorStyle = {
  ...navigationStyles,
  screenBackgroundColor: 'white'
}

function mapStateToProps(state) {
  return {
    messages: state.messages.entities,
    readBy: state.readBy.byMessage,
    viewer: state.viewer.user,
    roomMessagesResult: state.search.roomMessagesResult
  }
}

export default connect(mapStateToProps)(Message)
