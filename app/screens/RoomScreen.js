import React, {
  Component,
  PropTypes,
  InteractionManager,
  ToolbarAndroid,
  ToastAndroid,
  Alert,
  ListView,
  View
} from 'react-native'
import {connect} from 'react-redux'
import moment from 'moment'
import _ from 'lodash'
import s from '../styles/RoomStyles'
import {THEMES} from '../constants'
const {colors} = THEMES.gitterDefault

import {getRoom, selectRoom, joinRoom} from '../modules/rooms'
import {
  getRoomMessages,
  prepareListView,
  getRoomMessagesBefore,
  getRoomMessagesIfNeeded,
  subscribeToChatMessages,
  sendMessage,
  resendMessage,
  updateMessage
} from '../modules/messages'

import Loading from '../components/Loading'
import MessagesList from '../components/MessagesList'
import LoadginMoreSnack from '../components/LoadingMoreSnack'
import SendMessageField from '../components/SendMessageField'
import JoinRoomField from '../components/JoinRoomField'

class Room extends Component {
  constructor(props) {
    super(props)
    this.renderToolbar = this.renderToolbar.bind(this)
    this.renderListView = this.renderListView.bind(this)
    this.prepareDataSources = this.prepareDataSources.bind(this)
    this.onEndReached = this.onEndReached.bind(this)
    this.onSending = this.onSending.bind(this)
    this.onResendingMessage = this.onResendingMessage.bind(this)
    this.onJoinRoom = this.onJoinRoom.bind(this)
    this.onMessageLongPress = this.onMessageLongPress.bind(this)
    this.onTextFieldChange = this.onTextFieldChange.bind(this)

    this.state = {
      textInputValue: '',
      editing: false,
      editMessage: {}
    }
  }

  componentDidMount() {
    this.prepareDataSources()
    const {activeRoom, rooms, route: { roomId }, dispatch, listViewData} = this.props
    // dispatch(subscribeToChatMessages(roomId))

    InteractionManager.runAfterInteractions(() => {
      if (activeRoom !== roomId) {
        dispatch(selectRoom(roomId))
      }
      if (!rooms[roomId]) {
        dispatch(getRoom(roomId))
      }
      if (!listViewData[roomId]) {
        dispatch(getRoomMessages(roomId))
      } else {
        dispatch(getRoomMessagesIfNeeded(roomId))
      }
    })
  }

  onEndReached() {
    const {dispatch, route: {roomId}, hasNoMore, isLoadingMoreMessages, isLoadingMessages, listViewData} = this.props
    if (hasNoMore[roomId] !== true && isLoadingMoreMessages === false
        && isLoadingMessages === false && listViewData[roomId].data.length !== 0) {
      dispatch(getRoomMessagesBefore(roomId))
    }
  }

  onSending() {
    const {dispatch, route: {roomId}} = this.props
    if (this.state.editing) {
      this.onEndEdit()
    } else {
      dispatch(sendMessage(roomId, this.state.textInputValue))
      this.setState({textInputValue: ''})
    }
  }

  onResendingMessage(rowId, text) {
    const {dispatch, route: {roomId}} = this.props
    dispatch(resendMessage(roomId, rowId, text))
  }

  onJoinRoom() {
    const {dispatch, route: {roomId}} = this.props
    Alert.alert(
      'Join room',
      'Are you sure?',
      [
        {text: 'Cancel', onPress: () => console.log('Cancel Pressed!')}, // eslint-disable-line no-console
        {text: 'OK', onPress: () => dispatch(joinRoom(roomId))}
      ]
    )
  }

  onMessageLongPress(rowId, id) {
    const {currentUser, entities} = this.props
    const message = entities[id]
    const experied = moment(message.sent).add(10, 'm')
    let countDown = ''

    const actions = [
        {text: 'Copy text', onPress: () => console.log(text)}
    ]

    if (currentUser.username === message.fromUser.username &&
        moment().isBefore(experied) && !!message.text) {
      // timef which's show editing experied time
      setTimeout(() => {
        if (moment().isBefore(experied)) {
          const time = experied.subtract(moment()).format('mm:ss')
          countDown = `${time} to edit or delete`
        } else {
          countDown = `Can't edit or delete`
        }
      }, 1000)
      actions.push(
        {text: 'Delete', onPress: () => this.onDelete(rowId, id)},
        {text: 'Edit', onPress: () => this.onEdit(rowId, id)}
      )
    }
    // TODO: Use BottomSheet/ActionSheet instead of Alert
    Alert.alert('Actions', countDown, actions)
  }

  onDelete(rowId, id) {
    const {dispatch, route: {roomId}, entities} = this.props
    const message = entities[id]
    const experied = moment(message.sent).add(10, 'm')

    if (moment().isAfter(experied)) {
      ToastAndroid.show("Can't delete message.", ToastAndroid.SHORT)
      return false
    }

    const text = ''
    dispatch(updateMessage(roomId, id, text, rowId))
  }

  onEdit(rowId, id) {
    const {entities} = this.props
    const message = entities[id]
    const experied = moment(message.sent).add(10, 'm')

    if (moment().isAfter(experied)) {
      this.setState({editing: false})
      return false
    }

    this.refs.sendMessageField.focus()
    this.setState({
      textInputValue: message.text,
      editing: true,
      editMessage: {
        rowId, id
      }
    })
  }

  onEndEdit() {
    const {dispatch, route: {roomId}, entities} = this.props
    const {textInputValue, editMessage: {id, rowId}} = this.state
    const message = entities[id]
    const experied = moment(message.sent).add(5, 'm')

    if (moment().isAfter(experied)) {
      this.setState({
        editing: false,
        textInputValue: '',
        editMessage: {}
      })
      this.refs.sendMessageField.blur()
      ToastAndroid.show("Can't edit message.", ToastAndroid.SHORT)
      return false
    }

    dispatch(updateMessage(roomId, id, textInputValue, rowId))
    this.refs.sendMessageField.blur()
    this.setState({
      editing: false,
      editMessage: {},
      textInputValue: ''
    })
  }

  onTextFieldChange(text) {
    this.setState({textInputValue: text})
  }

  prepareDataSources() {
    const {listViewData, route: {roomId}, dispatch} = this.props
    if (!listViewData[roomId]) {
      const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => !_.isEqual(r1, r2)})
      dispatch(prepareListView(roomId, ds.cloneWithRows([])))
    }
  }

  renderToolbar() {
    const {rooms, route} = this.props
    // const actions = [
    //   {title: 'Search', icon: require('image!ic_search_white_24dp'), show: 'always'}
    // ]
    const room = rooms[route.roomId]
    return (
      <ToolbarAndroid
        navIcon={require('image!ic_menu_white_24dp')}
        onIconClicked={this.props.onMenuTap}
        title={room.name}
        titleColor="white"
        style={s.toolbar} />
    )
  }

  renderSendMessageFiled() {
    const {rooms, route: {roomId}} = this.props
    if (!rooms[roomId].roomMember) {
      return (
        <JoinRoomField
          onPress={this.onJoinRoom.bind(this)} />
      )
    }
    return (
      <SendMessageField
        ref="sendMessageField"
        onSending={this.onSending.bind(this)}
        onChange={this.onTextFieldChange.bind(this)}
        value={this.state.textInputValue} />
    )
  }

  renderLoadingMore() {
    return (
    <LoadginMoreSnack />
    )
  }

  renderLoading() {
    return (
      <Loading color={colors.raspberry}/>
    )
  }

  renderListView() {
    const {listViewData, dispatch, route: {roomId}} = this.props
    return (
      <MessagesList
        listViewData={listViewData[roomId]}
        onResendingMessage={this.onResendingMessage.bind(this)}
        onLongPress={this.onMessageLongPress.bind(this)}
        dispatch={dispatch}
        onEndReached={this.onEndReached.bind(this)} />
    )
  }

  render() {
    const {rooms, route, isLoadingMessages, isLoadingMoreMessages} = this.props
    if (!rooms[route.roomId]) {
      return this.renderLoading()
    }

    return (
      <View style={s.container}>
        {this.renderToolbar()}
        {isLoadingMoreMessages ? this.renderLoadingMore() : null}
        {isLoadingMessages ? this.renderLoading() : this.renderListView()}
        {this.renderSendMessageFiled()}
      </View>
    )
  }
}

Room.propTypes = {
  activeRoom: PropTypes.string,
  rooms: PropTypes.object,
  onMenuTap: PropTypes.func,
  route: PropTypes.object,
  dispatch: PropTypes.func,
  isLoadingMessages: PropTypes.bool,
  isLoadingMoreMessages: PropTypes.bool,
  listViewData: PropTypes.object,
  byRoom: PropTypes.object,
  entities: PropTypes.object,
  hasNoMore: PropTypes.object,
  currentUser: PropTypes.object
}

function mapStateToProps(state) {
  const {listView, isLoading, isLoadingMore, byRoom, hasNoMore, entities} = state.messages
  const {activeRoom, rooms} = state.rooms
  return {
    activeRoom,
    rooms,
    entities,
    listViewData: listView,
    isLoadingMessages: isLoading,
    isLoadingMoreMessages: isLoadingMore,
    byRoom,
    hasNoMore,
    currentUser: state.viewer.user,
  }
}

export default connect(mapStateToProps)(Room)
