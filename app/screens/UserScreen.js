import React, {
  Component,
  PropTypes,
  InteractionManager,
  ToolbarAndroid,
  Linking,
  ScrollView,
  View
} from 'react-native'
import {connect} from 'react-redux'
import ScrollableTabView from 'react-native-scrollable-tab-view'
import s from '../styles/screens/User/UserScreenStyles'
import * as Navigation from '../modules/navigation'
import {getUser, chatPrivately} from '../modules/users'

import {THEMES} from '../constants'
const {colors} = THEMES.gitterDefault

import Loading from '../components/Loading'
import UserTop from '../components/User/UserTop'
import UserInfo from '../components/User/UserInfo'

class UserScreen extends Component {
  constructor(props) {
    super(props)
    this.renderToolbar = this.renderToolbar.bind(this)
    this.navigateBack = this.navigateBack.bind(this)
    this.renderTabs = this.renderTabs.bind(this)
    this.renderUserInfoTab = this.renderUserInfoTab.bind(this)
    this.handleTabChange = this.handleTabChange.bind(this)
    this.handleGithubPress = this.handleGithubPress.bind(this)
    this.handleEmailPress = this.handleEmailPress.bind(this)
    this.handleChatPrivatelyPress = this.handleChatPrivatelyPress.bind(this)

    this.state = {
      activeTab: 0
    }
  }

  componentDidMount() {
    const {dispatch, route} = this.props
    InteractionManager.runAfterInteractions(() => {
      dispatch(getUser(route.username))
    })
  }

  handleTabChange({i}) {
    this.setState({
      activeTab: i
    })
  }

  handleGithubPress(url) {
    Linking.openURL(url)
  }

  handleEmailPress(email) {
    Linking.openURL(`mailto:${email}`)
  }

  handleChatPrivatelyPress(userId) {
    const {dispatch} = this.props
    dispatch(chatPrivately(userId))
  }

  navigateBack() {
    const {dispatch} = this.props
    dispatch(Navigation.goBack())
  }

  renderToolbar() {
    const {route} = this.props
    return (
      <ToolbarAndroid
        navIcon={require('image!ic_arrow_back_white_24dp')}
        onIconClicked={this.navigateBack}
        title="User"
        titleColor="white"
        style={s.toolbar} />
    )
  }

  renderTabs() {
    return (
      <View style={s.tabsContainer}>
        <ScrollableTabView
          initialPage={this.state.activeTab}
          tabBarBackgroundColor={colors.raspberry}
          tabBarUnderlineColor="white"
          tabBarActiveTextColor="white"
          tabBarInactiveTextColor={colors.androidGray}
          onChangeTab={this.handleTabChange}
          style={s.tabs}>
          <View tabLabel="INFO" style={s.container}>
            {this.renderUserInfoTab()}
          </View>
          <View tabLabel="REPOS" style={s.container}>

          </View>
        </ScrollableTabView>
    </View>
    )
  }

  renderUserInfoTab() {
    const {isLoadingUsers, users, route, currentUserId} = this.props
    const user = users[route.userId]
    if (isLoadingUsers || !user) {
      return (
        <Loading />
      )
    }
    return (
      <ScrollView style={s.container}>
        <UserTop {...user} />
        <UserInfo {...user}
          onEmailPress={this.handleEmailPress.bind(this)}
          onGithubPress={this.handleGithubPress.bind(this)}
          onChatPrivatelyPress={this.handleChatPrivatelyPress.bind(this)}
          currentUserId={currentUserId} />
      </ScrollView>
    )
  }


  render() {
    return (
      <View style={s.container}>
        {this.renderToolbar()}
        {this.renderUserInfoTab()}
      </View>
    )
  }
}

UserScreen.propTypes = {
  dispatch: PropTypes.func,
  isLoadingUsers: PropTypes.bool,
  users: PropTypes.object,
  route: PropTypes.object,
  currentUserId: PropTypes.string
}


function mapStateToProps(state) {
  const {current} = state.navigation
  const {isLoadingUsers} = state.users
  const {id} = state.viewer.user
  return {
    isLoadingUsers,
    currentUserId: id,
    // route: current,
    users: state.users.entities
  }
}

export default connect(mapStateToProps)(UserScreen)
