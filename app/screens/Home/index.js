import PropTypes from 'prop-types'
import React, { Component } from 'react'
import {ScrollView, Text, View} from 'react-native';
import {connect} from 'react-redux'
import s from './styles'
import {iconsMap} from '../../utils/iconsMap'

import HomeRoomItem from './HomeRoomItem'
import HomeRoomItemMy from './HomeRoomItemMy'
import Loading from '../../components/Loading'

import {THEMES} from '../../constants'
const {colors} = THEMES.gitterDefault

export let homeNavigator = null

class HomeScreen extends Component {
  constructor(props) {
    super(props)
    this.renderBottom = this.renderBottom.bind(this)
    this.onRoomPress = this.onRoomPress.bind(this)

    homeNavigator = this.props.navigator

    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this))

    this.props.navigator.setButtons({
      leftButtons: [{
        title: 'Menu',
        id: 'sideMenu',
        icon: iconsMap['menu-white'],
        iconColor: 'white',
        showAsAction: 'always'
      }],
      rightButtons: [{
        title: 'Search',
        id: 'search',
        icon: iconsMap['search-white'],
        showAsAction: 'always'
      }]
    })

    this.props.navigator.setTitle({
      title: 'Home'
    })
  }


  onNavigatorEvent(event) {
    if (event.type === 'NavBarButtonPress') {
      if (event.id === 'search') {
        this.props.navigator.push({screen: 'gm.Search'})
      }
      if (event.id === 'sideMenu') {
        this.props.navigator.toggleDrawer({side: 'left', animated: true})
      }
    }
  }

  onRoomPress(id) {
    this.props.navigator.push({screen: 'gm.Room', passProps: {roomId: id}})
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
          <HomeRoomItemMy
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
        <View style={s.loadingWrap}>
          <Loading
            color={colors.brand}/>
        </View>
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

  render() {
    return (
      <View style={s.container}>
        <ScrollView contentContainerStyle={s.scrollContainer}>
          {this.renderBottom()}
        </ScrollView>
      </View>
    )
  }
}


HomeScreen.navigatorStyle = {
  navBarBackgroundColor: colors.raspberry,
  navBarButtonColor: 'white',
  navBarTextColor: 'white',
  topBarElevationShadowEnabled: true,
  statusBarColor: colors.darkRed,
  statusBarTextColorScheme: 'dark'
}

HomeScreen.propTypes = {
  isLoadingRooms: PropTypes.bool,
  isLoadingViewer: PropTypes.bool,
  userId: PropTypes.string,
  rooms: PropTypes.object,
  roomsIds: PropTypes.array,
  suggested: PropTypes.array,
  dispatch: PropTypes.func,
  navigator: PropTypes.object
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
