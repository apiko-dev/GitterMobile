import React, {
  PropTypes,
  Component,
  View
} from 'react-native'
import {connect} from 'react-redux'
import s from '../styles/screens/RoomInfo/RoomInfoScreenStyles'
import * as Navigation from '../modules/navigation'
import {THEMES} from '../constants'
const {colors} = THEMES.gitterDefault

import {changeRoomInfoTab} from '../modules/ui'

import ScrollableTabView from 'react-native-scrollable-tab-view'
import Loading from '../components/Loading'

class RoomInfoScreen extends Component {
  constructor(props) {
    super(props)
    this.renderTabs = this.renderTabs.bind(this)
    this.renderRoomInfoTab = this.renderRoomInfoTab.bind(this)
    this.renderPeopleTab = this.renderPeopleTab.bind(this)
    this.handleTabChange = this.handleTabChange.bind(this)
  }

  handleTabChange({i}) {
    const {dispatch} = this.props
    dispatch(changeRoomInfoTab(i))
  }

  renderTabs() {
    return (
      <View style={s.tabsContainer}>
        <ScrollableTabView
          initialPage={this.props.roomInfoActiveTab}
          tabBarBackgroundColor="white"
          tabBarUnderlineColor={colors.raspberry}
          tabBarActiveTextColor={colors.raspberry}
          tabBarInactiveTextColor={colors.darkRed}
          onChangeTab={this.handleTabChange}
          style={s.tabs}>
          <View tabLabel="INFO" style={s.container}>
            {this.renderRoomInfoTab()}
          </View>
          <View tabLabel="PEOPLE" style={s.container}>
            {this.renderPeopleTab()}
          </View>
        </ScrollableTabView>
    </View>
    )
  }

  renderRoomInfoTab() {
    return (
      <View style={{flex: 1}}>
        <Loading />
      </View>
    )
  }

  renderPeopleTab() {
    return (
      <View style={{flex: 1}}>
        <Loading />
      </View>
    )
  }


  render() {
    return (
      <View style={s.container}>
        {this.renderTabs()}
      </View>
    )
  }
}

RoomInfoScreen.propTypes = {
  dispatch: PropTypes.func,
  drawer: PropTypes.element,
  route: PropTypes.objectб,
  roomInfoActiveTab: PropTypes.number
}

function mapStateToProps(state) {
  const {roomInfoActiveTab} = state.ui

  return {
    roomInfoActiveTab
  }
}

export default connect(mapStateToProps)(RoomInfoScreen)
