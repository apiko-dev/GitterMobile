import React, {
  Component,
  PropTypes,
  InteractionManager,
  ToolbarAndroid,
  Alert,
  ListView,
  View
} from 'react-native'
import {connect} from 'react-redux'
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
  resendMessage
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

  onSending(text) {
    const {dispatch, route: {roomId}} = this.props
    dispatch(sendMessage(roomId, text))
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
        onSending={this.onSending.bind(this)}/>
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
        onResendingMessage={this.onResendingMessage}
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
  hasNoMore: PropTypes.object
}

function mapStateToProps(state) {
  return {
    activeRoom: state.rooms.activeRoom,
    rooms: state.rooms.rooms,
    listViewData: state.messages.listView,
    isLoadingMessages: state.messages.isLoading,
    isLoadingMoreMessages: state.messages.isLoadingMore,
    byRoom: state.messages.byRoom,
    hasNoMore: state.messages.hasNoMore
  }
}

export default connect(mapStateToProps)(Room)
