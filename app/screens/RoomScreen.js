import React, {
  Component,
  PropTypes,
  ToolbarAndroid,
  View
} from 'react-native'
import {connect} from 'react-redux'
import ExtraDimensions from 'react-native-extra-dimensions-android'
import s from '../styles/RoomStyles'
import {THEMES} from '../constants'
const {colors} = THEMES.gitterDefault

import {getRoom} from '../modules/rooms'

import Loading from '../components/Loading'

const STATUS_BAR_HEIGHT = ExtraDimensions.get('STATUS_BAR_HEIGHT')

class Room extends Component {
  constructor(props) {
    super(props)
    this.renderToolbar = this.renderToolbar.bind(this)
  }

  componentWillMount() {
    const {rooms, route, dispatch} = this.props
    if (!rooms[route.roomId]) {
      dispatch(getRoom(route.roomId))
    }
  }

  renderToolbar() {
    const {rooms, route} = this.props
    // const actions = [
    //   {title: 'Search', icon: require('image!ic_search_white_24dp'), show: 'always'}
    // ]
    const room = rooms[route.roomId]
    return (
      <View>
        <View style={s.toolbarPadding} />
        <ToolbarAndroid
          navIcon={require('image!ic_menu_white_24dp')}
          onIconClicked={this.props.onMenuTap}
          title={room.name}
          titleColor="white"
          style={s.toolbar} />
      </View>
    )
  }

  render() {
    const {rooms, route} = this.props
    if (!rooms[route.roomId]) {
      return <Loading color={colors.raspberry}/>
    }
    return (
      <View style={s.container}>
        {this.renderToolbar()}
      </View>
    )
  }
}

Room.propTypes = {
  rooms: PropTypes.object,
  onMenuTap: PropTypes.func,
  route: PropTypes.object,
  dispatch: PropTypes.func
}

function mapStateToProps(state) {
  return {
    rooms: state.rooms.rooms
  }
}

export default connect(mapStateToProps)(Room)
