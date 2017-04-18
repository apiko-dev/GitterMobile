import React, {Component, PropTypes} from 'react';
import {View, ScrollView} from 'react-native';
import {connect} from 'react-redux'
import s from './styles'

import Toolbar from '../../components/Toolbar'

import {subscribeToReadBy, unsubscribeFromReadBy} from '../../modules/realtime'
import * as Navigation from '../../modules/navigation'

import ReadBy from './ReadBy'
import Msg from './Message'

class Message extends Component {
  constructor(props) {
    super(props)

    this.renderMessage = this.renderMessage.bind(this)
    // this.renderReadBy = this.renderReadBy.bind(this)
    this.renderToolbar = this.renderToolbar.bind(this)
    this.navigateBack = this.navigateBack.bind(this)
    this.handleAvatarPress = this.handleAvatarPress.bind(this)
  }

  componentWillMount() {
    const {dispatch, route: {roomId, messageId}} = this.props
    dispatch(subscribeToReadBy(roomId, messageId))
  }

  componentWillUnmount() {
    const {dispatch} = this.props
    dispatch(unsubscribeFromReadBy())
  }

  handleAvatarPress(id, username) {
    const {dispatch} = this.props
    dispatch(Navigation.goTo({name: 'user', userId: id, username}))
  }

  navigateBack() {
    const {dispatch} = this.props
    dispatch(Navigation.goBack())
  }

  renderToolbar() {
    return (
      <Toolbar
        navIconName="arrow-back"
        iconColor="white"
        onIconClicked={this.navigateBack}
        title="Message"
        titleColor="white"
        style={s.toolbar} />
    )
  }

  renderMessage() {
    const {messages, route: {messageId, fromSearch}, viewer, roomMessagesResult} = this.props
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
    const {readBy, route: {messageId}} = this.props
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
        {this.renderToolbar()}
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

function mapStateToProps(state) {
  return {
    messages: state.messages.entities,
    readBy: state.readBy.byMessage,
    viewer: state.viewer.user,
    roomMessagesResult: state.search.roomMessagesResult
  }
}

export default connect(mapStateToProps)(Message)
