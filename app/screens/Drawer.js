import React, {
  Component,
  PropTypes,
  View,
  Text
} from 'react-native'
import {connect} from 'react-redux'
import s from '../styles/DrawerStyles'
import DrawerUserInfo from '../components/DrawerUserInfo'
import ChannelList from '../components/ChannelList'
import Loading from '../components/Loading'
import {categorize} from '../utils/sortRoomsByType'

import {THEMES} from '../constants'
const {colors} = THEMES.gitterDefault

class Drawer extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const {user, isLoadingUser, isLoadingRooms, ids, rooms} = this.props

    return (
      <View style={[s.container, {backgroundColor: colors.gray}]}>
        <DrawerUserInfo {...user}/>
        {ids.length === 0? <Loading color={colors.brand}/> : <ChannelList {...this.props} />}
      </View>
    )
  }
}

Drawer.propTypes = {
  isLoadingUser: PropTypes.bool,
  isLoadingRooms: PropTypes.bool,
  navigator: PropTypes.func.isRequired,
  user: PropTypes.object,
  ids: PropTypes.array,
  rooms: PropTypes.object
}

Drawer.defaultProps = {
  isLoadingUser: true,
  isLoadingRooms: true
}

function mapStateToProps(state) {
  return {
    isLoadingUser: state.viewer.isLoading,
    isLoadingRooms: state.rooms.isLoading,
    user: state.viewer.user,
    ids: state.rooms.ids,
    rooms: state.rooms.rooms
  }
}

export default connect(mapStateToProps)(Drawer)
