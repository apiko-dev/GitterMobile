import React, {
  Component,
  PropTypes,
  ToolbarAndroid,
  Dimensions,
  Image,
  Text,
  View
} from 'react-native'
import {connect} from 'react-redux'
import ExtraDimensions from 'react-native-extra-dimensions-android'
import {selectRoom} from '../modules/rooms'
import s from '../styles/HomeStyles'

import ParallaxScrollView from '../components/ParallaxScrollView'
import HomeRoomItem from '../components/HomeRoomItem'
import Loading from '../components/Loading'

import {THEMES} from '../constants'
const {colors} = THEMES.gitterDefault

const STATUS_BAR_HEIGHT = ExtraDimensions.get('STATUS_BAR_HEIGHT')
const PARALLAX_HEADER_HEIGHT = 400
const LOADING_HEIGHT = Dimensions.get('window').height - PARALLAX_HEADER_HEIGHT

class HomeScreen extends Component {
  constructor(props) {
    super(props)
    this.renderBottom = this.renderBottom.bind(this)
    this.renderStickyHeader = this.renderStickyHeader.bind(this)
    this.onRoomPress = this.onRoomPress.bind(this)
  }

  onRoomPress(id) {
    this.props.dispatch(selectRoom(id))
    this.props.navigateTo({name: 'room', roomId: id})
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
          height={LOADING_HEIGHT}
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

  renderStickyHeader() {
    const actions = [
      {title: 'Search', icon: require('image!ic_search_white_24dp'), show: 'always'}
    ]
    return (
      <ToolbarAndroid
        actions={actions}
        navIcon={require('image!ic_menu_white_24dp')}
        onIconClicked={this.props.onMenuTap}
        title="Home"
        titleColor="white"
        style={[s.toolbar, {paddingTop: STATUS_BAR_HEIGHT}]} />
    )
  }

  renderForeground() {
    return (
      <View style={[s.foreground, { height: PARALLAX_HEADER_HEIGHT}]}>
         <Text style={s.welcome}>
           Welcome to Gitter mobile!
         </Text>
       </View>
    )
  }


  render() {
    return (
      <View style={s.container}>
          <ParallaxScrollView
             backgroundColor={colors.brand}
             contentBackgroundColor="white"
             parallaxHeaderHeight={PARALLAX_HEADER_HEIGHT}
             pivotOffset={56}
             renderStickyHeader={() => this.renderStickyHeader()}
             renderBackground={() => <Image source={require('../images/gitter-background.jpg')}/>}
             renderForeground={() => this.renderForeground()} >

          {this.renderBottom()}
        </ParallaxScrollView>
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
  navigateTo: PropTypes.func,
  route: PropTypes.object
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
