import PropTypes from 'prop-types'
import React, {Component} from 'react'
import {View, ScrollView, Platform} from 'react-native'
import {connect} from 'react-redux'
import s from './styles'
import navigationStyles from '../../styles/common/navigationStyles'
import Loading from '../../components/Loading'
import {THEMES} from '../../constants'
import {getSingleMessage} from '../../modules/messages'
import {subscribeToReadBy, unsubscribeFromReadBy} from '../../modules/realtime'
import FailedToLoad from '../../components/FailedToLoad'

import ReadBy from './ReadBy'
import Msg from './Message'

const {colors} = THEMES.gitterDefault

class Message extends Component {
  constructor(props) {
    super(props)

    this.renderMessage = this.renderMessage.bind(this)
    this.renderReadBy = this.renderReadBy.bind(this)
    this.handleAvatarPress = this.handleAvatarPress.bind(this)
    this.retryToLoadMessage = this.componentWillMount.bind(this)

    this.props.navigator.setTitle({title: 'Message'})
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this))
    this.props.navigator.setButtons(
      Platform.OS === 'ios' ? {
        leftButtons: [{
          title: 'Close',
          id: 'close',
          iconColor: 'white',
          // icon: iconsMap.back,
          showAsAction: 'always'
        }]
      } : {}
    )
  }

  componentWillMount() {
    const {dispatch, route, roomId, messageId} = this.props
    if (route) {
      dispatch(getSingleMessage(roomId, messageId))
    }

    if (!this.props.isLoadingMessage) {
      dispatch(subscribeToReadBy(roomId, messageId))
    }
  }

  componentWillUnmount() {
    const {dispatch} = this.props
    dispatch(unsubscribeFromReadBy())
  }

  onNavigatorEvent(event) {
    if (event.type === 'NavBarButtonPress') {
      if (event.id === 'close') {
        this.props.navigator.dismissModal({
          animationType: 'slide-down'
        })
      }
    }
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

    if (!message) {
      return null
    }

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
    if (this.props.isLoadingMessage) {
      return (
        <View style={s.container}>
          <Loading color={colors.raspberry} />
        </View>
      )
    }

    if (this.props.error) {
      return (
        <FailedToLoad
          message="Failed to load message."
          onRetry={this.retryToLoadMessage} />
      )
    }

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
  fromSearch: PropTypes.bool,
  roomId: PropTypes.string,
  messageId: PropTypes.string,
  navigator: PropTypes.object,
  dispatch: PropTypes.func,
  route: PropTypes.shape({
    roomId: PropTypes.string,
    messageId: PropTypes.string
  }),
  error: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  isLoadingMessage: PropTypes.bool,
  messages: PropTypes.object,
  readBy: PropTypes.object,
  viewer: PropTypes.object,
  roomMessagesResult: PropTypes.array
}

Message.navigatorStyle = {
  ...navigationStyles,
  screenBackgroundColor: 'white'
}

function mapStateToProps(state, props) {
  return {
    isLoadingMessage: state.messages.isLoadingMessage,
    messages: state.messages.entities,
    readBy: state.readBy.byMessage,
    viewer: state.viewer.user,
    roomMessagesResult: state.search.roomMessagesResult,
    roomId: props.roomId || props.route.roomId,
    messageId: props.messageId || props.route.messageId,
    error: state.messages.singleMessageError ? state.messages.errors : null
  }
}

export default connect(mapStateToProps)(Message)
