import React, {
  Component,
  PropTypes,
  ToolbarAndroid,
  ScrollView,
  Text,
  View
} from 'react-native'
import {connect} from 'react-redux'
import s from '../styles/screens/Home/HomeScreenStyles'
import * as Navigation from '../modules/navigation'

import HomeRoomItem from '../components/Home/HomeRoomItem'
import Loading from '../components/Loading'

import {THEMES} from '../constants'
const {colors} = THEMES.gitterDefault


class HomeScreen extends Component {
  constructor(props) {
    super(props)
    this.renderBottom = this.renderBottom.bind(this)
    this.renderToolbar = this.renderToolbar.bind(this)
    this.onRoomPress = this.onRoomPress.bind(this)
    this.handleActionPress = this.handleActionPress.bind(this)
  }

  onRoomPress(id) {
    this.props.navigateTo({name: 'room', roomId: id})
  }

  handleActionPress(index) {
    const {dispatch} = this.props
    if (index === 0) {
      dispatch(Navigation.goTo({name: 'search'}))
    }
  }

  renderOrgs(orgs) {
    if (orgs.length === 0) {
      return null
    }
    return (
      <View style={s.roomItem}>
        <Text style={s.bottomSectionHeading}>Organizations</Text>
        {orgs.map(org => (
          <HomeRoomItem
            onPress={this.onRoomPress.bind(this)}
            key={org.id}
            {...org} />
        ))}
      </View>
    )
  }

  renderFavorite(favorites) {
    if (favorites.length === 0) {
      return null
    }
    return (
      <View style={s.roomItem}>
        <Text style={s.bottomSectionHeading}>Favorites</Text>
        {favorites.map(favorite => (
          <HomeRoomItem
            onPress={this.onRoomPress.bind(this)}
            key={favorite.id}{...favorite} />
        ))}
      </View>
    )
  }

  renderSuggested(suggested) {
    if (suggested.length === 0) {
      return null
    }
    return (
      <View style={s.roomItem}>
        <Text style={s.bottomSectionHeading}>Suggested rooms</Text>
        {suggested.map(room => (
          <HomeRoomItem
            onPress={this.onRoomPress.bind(this)}
            key={room.id}
            id={room.id}
            name={room.uri}
            oneToOne={false}
            {...room} />
        ))}
      </View>
    )
  }

  renderBottom() {
    const {isLoadingRooms, isLoadingViewer, rooms, roomsIds, suggested} = this.props

    if (isLoadingRooms || isLoadingViewer || !suggested) {
      return (
        <Loading
          color={colors.brand}/>
      )
    }

    const favorites = roomsIds.filter(id => rooms[id].hasOwnProperty('favourite')).map(id => rooms[id])
    const orgs = roomsIds.filter(id => (rooms[id].githubType === 'ORG')).map(id => rooms[id])

    return (
      <View style={s.bottom}>
        {this.renderOrgs(orgs)}
        {this.renderFavorite(favorites)}
        {this.renderSuggested(suggested)}
      </View>
    )
  }

  renderToolbar() {
    const actions = [
      {title: 'Search', icon: require('image!ic_search_white_24dp'), show: 'always'}
    ]
    return (
      <ToolbarAndroid
        actions={actions}
        navIcon={require('image!ic_menu_white_24dp')}
        onIconClicked={this.props.onMenuTap}
        onActionSelected={this.handleActionPress}
        title="Home"
        titleColor="white"
        style={s.toolbar} />
    )
  }


  render() {
    return (
      <View style={s.container}>
        {this.renderToolbar()}
        <ScrollView>
          {this.renderBottom()}
        </ScrollView>
      </View>
    )
  }
}

HomeScreen.propTypes = {
  onMenuTap: PropTypes.func.isRequired,
  isLoadingRooms: PropTypes.bool,
  isLoadingViewer: PropTypes.bool,
  userId: PropTypes.string,
  rooms: PropTypes.object,
  roomsIds: PropTypes.array,
  suggested: PropTypes.array,
  dispatch: PropTypes.func,
  navigateTo: PropTypes.func
}

HomeScreen.defaultProps = {
  isLoadingRooms: true,
  isLoadingViewer: true
}

function mapStateToProps(state) {
  const {viewer, rooms} = state

  return {
    isLoadingRooms: rooms.isLoading,
    isLoadingViewer: viewer.isLoading,
    userId: viewer.user.id,
    roomsIds: rooms.ids,
    rooms: rooms.rooms,
    suggested: rooms.suggestedRooms
  }
}

export default connect(mapStateToProps)(HomeScreen)
