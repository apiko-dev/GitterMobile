import React, {
  PropTypes,
  Component,
  ScrollView,
  View
} from 'react-native'
import {connect} from 'react-redux'
import s from '../styles/screens/RoomInfo/RoomInfoScreenStyles'
import {THEMES} from '../constants'
const {colors} = THEMES.gitterDefault
import _ from 'lodash'

import {clearRoomInfoError, getRoomInfo} from '../modules/roomInfo'

import Loading from '../components/Loading'
import FailedToLoad from '../components/FailedToLoad'
import RoomInfo from '../components/RoomInfo/RoomInfo'

class RoomInfoScreen extends Component {
  constructor(props) {
    super(props)
    this.renderInfo = this.renderInfo.bind(this)
    this.renderUsers = this.renderUsers.bind(this)
    this.refetchData = this.refetchData.bind(this)
  }

  componentDidMount() {
    const {dispatch} = this.props
    dispatch(clearRoomInfoError())
  }

  componentWillReceiveProps(nextProps) {
    if (_.isEqual(this.props, nextProps)) {
      return
    }

    const {rooms, roomInfo, route: {roomId}, dispatch, roomInfoDrawerState} = nextProps
    const room = rooms[roomId]
    if (!!room && roomInfoDrawerState === 'open' && !roomInfo[room.name]) {
      dispatch(getRoomInfo(room.name, roomId))
    }
  }

  refetchData() {
    const {rooms, route: {roomId}, dispatch} = this.props
    const room = rooms[roomId]
    dispatch(clearRoomInfoError())
    dispatch(getRoomInfo(room.name, roomId))
  }

  renderInfo() {
    const {rooms, roomInfo, route: {roomId}} = this.props

    if (rooms[roomId].githubType === 'REPO') {
      return (
        <RoomInfo
          {...roomInfo[rooms[roomId].name]} />
      )
    }
    return <View style={s.container}/>
  }

  renderUsers() {

  }


  render() {
    const {rooms, roomInfo, route: {roomId}, isError} = this.props
    const room = rooms[roomId]
    if (isError) {
      return (
        <View style={s.container}>
          <FailedToLoad
            message="Failed to load room info."
            onRetry={this.refetchData.bind(this)} />
        </View>
      )
    }

    if (!room || !roomInfo[room.name]) {
      return (
        <View style={s.container}>
          <Loading />
        </View>
      )
    }
    return (
      <View style={s.container}>
        <ScrollView>
          {this.renderInfo()}
        </ScrollView>
      </View>
    )
  }
}

RoomInfoScreen.propTypes = {
  dispatch: PropTypes.func,
  drawer: PropTypes.element,
  route: PropTypes.object,
  roomInfo: PropTypes.object,
  rooms: PropTypes.object,
  roomInfoDrawerState: PropTypes.string,
  isError: PropTypes.bool
}

function mapStateToProps(state) {
  return {
    roomInfo: state.roomInfo.entities,
    rooms: state.rooms.rooms,
    roomInfoDrawerState: state.ui.roomInfoDrawerState,
    isError: state.roomInfo.isError
  }
}

export default connect(mapStateToProps)(RoomInfoScreen)
