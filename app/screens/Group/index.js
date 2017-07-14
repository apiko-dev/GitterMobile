import React, {PropTypes, Component} from 'react'
import {connect} from 'react-redux'
import {View, ListView} from 'react-native'
import RoomItem from '../Home/HomeRoomItem'
import Loading from '../../components/Loading'
import {THEMES} from '../../constants'
import s from './styles'
import {getGroupRooms} from '../../modules/groups'
import {iconsMap} from '../../utils/iconsMap'

const {colors} = THEMES.gitterDefault

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

class Group extends Component {
  constructor(props) {
    super(props)

    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this))
    this.props.navigator.setTitle({title: this.props.name})
    this.props.navigator.setButtons({
      leftButtons: [{
        title: 'Menu',
        id: 'sideMenu',
        icon: iconsMap['menu-white'],
        iconColor: 'white',
        showAsAction: 'always'
      }]
    })

    this.renderListItem = this.renderListItem.bind(this)
    this.onRoomPress = this.onRoomPress.bind(this)
  }

  componentWillMount() {
    const {groupId, dispatch} = this.props

    dispatch(getGroupRooms(groupId))
  }

  onNavigatorEvent(event) {
    if (event.type === 'NavBarButtonPress') {
      if (event.id === 'sideMenu') {
        this.props.navigator.toggleDrawer({side: 'left', animated: true})
      }
    }
  }

  onRoomPress(id) {
    this.props.navigator.push({screen: 'gm.Room', passProps: {roomId: id}})
  }

  renderListItem(item) {
    return <RoomItem
      key={item.id}
      onPress={this.onRoomPress}
      {...item} />
  }

  render() {
    const {isLoading} = this.props

    if (isLoading) {
      return (
        <View style={s.loadingWrap}>
          <Loading
            color={colors.brand}/>
        </View>
      )
    }

    return (
      <ListView
        dataSource={ds.cloneWithRows(this.props.rooms)}
        renderRow={this.renderListItem}
        style={s.container}
        enableEmptySections
        removeClippedSubviews />
    )
  }
}

Group.navigatorStyle = {
  navBarBackgroundColor: colors.raspberry,
  navBarButtonColor: 'white',
  navBarTextColor: 'white',
  topBarElevationShadowEnabled: true,
  statusBarColor: colors.darkRed,
  statusBarTextColorScheme: 'dark'
}

Group.propTypes = {
  groupId: PropTypes.string,
  rooms: PropTypes.array,
  navigator: PropTypes.object,
  isLoading: PropTypes.bool,
  dispatch: PropTypes.func,
  name: PropTypes.string
}

const mapStateToProps = ({groups: {groups, ...info}}, {groupId}) => {
  const {rooms, name} = groups[groupId]

  return ({
    rooms: rooms || [],
    name,
    ...info
  })
}

export default connect(mapStateToProps)(Group)
