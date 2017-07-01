import PropTypes from 'prop-types'
import React, { Component } from 'react'
import {TextInput, View, Text, Clipboard, ToastAndroid, Platform} from 'react-native';
import {connect} from 'react-redux'
import _ from 'lodash'
import {setInputValue, searchRoomMessages, clearSearch} from '../../modules/search'
import s from './styles'
import {THEMES} from '../../constants'
import {quoteLink} from '../../utils/links'
import moment from 'moment'

import Toolbar from '../../components/Toolbar'

import Loading from '../../components/Loading'
import MessagesList from './MessagesList'
import BottomSheet from '../../../libs/react-native-android-bottom-sheet/index'

import navigationStyles from '../../styles/common/navigationStyles'

const {colors} = THEMES.gitterDefault

class SearchScreen extends Component {
  constructor(props) {
    super(props)

    this.renderToolbar = this.renderToolbar.bind(this)
    this.navigateBack = this.navigateBack.bind(this)
    this.handleActionPress = this.handleActionPress.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.searchRequest = _.debounce(this.searchRequest.bind(this), 250)
    this.renderMessages = this.renderMessages.bind(this)
    this.handleMessagePress = this.handleMessagePress.bind(this)
    this.handleDialogPress = this.handleDialogPress.bind(this)
    this.handleCopyToClipboard = this.handleCopyToClipboard.bind(this)
    this.handleQuoteWithLinkPress = this.handleQuoteWithLinkPress.bind(this)
    this.handleUserAvatarPress = this.handleUserAvatarPress.bind(this)
    this.handleMessageLongPress = this.handleMessageLongPress.bind(this)

    this.state = {
      value: ''
    }
  }

  componentDidMount() {
    // dirty hack to get text input focus on mounting
    // it won't focus because of tab-view without delay
    // for some reasons
    setTimeout(() => this.refs.textInput.focus(), 500)
  }

  handleMessagePress(id, rowId, messageText) {
    const {roomMessagesResult} = this.props
    const message = roomMessagesResult.find(item => item.id === id)
    const options = {
      title: messageText,
      items: [
        'Copy text',
        'Quote with link'
      ]
    }

    // TODO: Use BottomSheet/ActionSheet instead of Alert
    BottomSheet.showBotttomSheetWithOptions(options, (index, itemText) =>
      this.handleDialogPress(message, index, itemText))
  }

  handleDialogPress(message, index, itemText) {
    switch (itemText) {
    case 'Copy text':
      return this.handleCopyToClipboard(message.text)
    case 'Quote with link':
      this.handleQuoteWithLinkPress(message)
      break
    default:
      break
    }
  }

  handleCopyToClipboard(text) {
    Clipboard.setString(text)
    ToastAndroid.show('Copied', ToastAndroid.SHORT)
  }

  handleQuoteWithLinkPress(message) {
    const {room} = this.props
    const time = moment(message.sent).format('YYYY MMM D, HH:mm')
    const link = quoteLink(time, room.url, message.id)

    Clipboard.setString(link)
    ToastAndroid.show('Copied quote link', ToastAndroid.SHORT)
  }

  handleUserAvatarPress(id, username) {
    const {navigator} = this.props
    navigator.showModal({screen: 'gm.User', passProps: {userId: id, username}})
  }

  handleMessageLongPress(messageId) {
    const {navigator, roomId} = this.props
    navigator.showModal({screen: 'gm.Message', passProps: {messageId, roomId, fromSearch: true}})
  }

  navigateBack() {
    const {dispatch, navigator} = this.props
    navigator.dismissModal()
    dispatch(clearSearch())
  }

  handleActionPress(index) {
    const {dispatch} = this.props
    if (index === 0) {
      this.setState({value: ''})
      dispatch(clearSearch())
    }
  }

  handleInputChange(event) {
    const {text} = event.nativeEvent
    this.setState({value: text})
    this.searchRequest(text)
  }

  searchRequest(text) {
    const {dispatch, roomId} = this.props

    dispatch(setInputValue(text))

    if (!text.trim()) {
      return
    }

    dispatch(searchRoomMessages(roomId, text))
  }

  renderToolbar() {
    const {value} = this.state
    const actions = !!value
      ? [{title: 'Clear', iconName: 'close', iconColor: 'white', show: 'always'}]
      : []

    return (
      <Toolbar
        navIconName={Platform.OS === 'ios' ? 'chevron-left' : 'arrow-back'}
        iconColor="white"
        onIconClicked={this.navigateBack}
        actions={actions}
        onActionSelected={this.handleActionPress}
        style={s.toolbar}>
        <View style={s.toolbarContainer}>
          <TextInput
            ref="textInput"
            style={s.textInput}
            value={value}
            keyboardShouldPersistTaps={false}
            underlineColorAndroid={colors.raspberry}
            placeholderTextColor={colors.androidGray}
            onChange={this.handleInputChange}
            placeholder="Type your search query..." />
        </View>
      </Toolbar>
    )
  }

  renderLoading() {
    return (
      <Loading color={colors.raspberry}/>
    )
  }

  renderMessages() {
    const {roomMessagesResult} = this.props

    if (!roomMessagesResult.length) {
      return (
        <View style={s.container}>
          <Text style={s.text}>
            No result to display.
          </Text>
        </View>
      )
    }

    return (
      <MessagesList
        onPress={this.handleMessagePress}
        onLongPress={this.handleMessageLongPress}
        onUserAvatarPress={this.handleUserAvatarPress}
        items={roomMessagesResult} />
    )
  }

  render() {
    const {isLoadingRoomMessages} = this.props
    return (
      <View style={s.container}>
        {this.renderToolbar()}
        {isLoadingRoomMessages ? this.renderLoading() : this.renderMessages()}
      </View>
    )
  }
}

SearchScreen.propTypes = {
  dispatch: PropTypes.func,
  route: PropTypes.object,
  isLoadingRoomMessages: PropTypes.bool,
  inputValue: PropTypes.string,
  roomMessagesResult: PropTypes.array,
  room: PropTypes.object
}

SearchScreen.navigatorStyle = {
  ...navigationStyles,
  navBarHidden: true
}

function mapStateToProps(state, ownProps) {
  const {
    isLoadingRoomMessages,
    inputValue,
    roomMessagesResult
  } = state.search
  const {rooms} = state.rooms
  return {
    isLoadingRoomMessages,
    inputValue,
    roomMessagesResult,
    room: rooms[ownProps.roomId]
  }
}

export default connect(mapStateToProps)(SearchScreen)
