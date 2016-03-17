import React, {
  Component,
  PropTypes,
  ToolbarAndroid,
  Image,
  Text,
  View
} from 'react-native'
import {connect} from 'react-redux'
import s from '../styles/UserScreenStyles'
import * as Navigation from '../modules/navigation'
import {getUser} from '../modules/users'

import Loading from '../components/Loading'

class UserScreen extends Component {
  constructor(props) {
    super(props)
    this.renderToolbar = this.renderToolbar.bind(this)
    this.navigateBack = this.navigateBack.bind(this)
    this.renderTopInfo = this.renderTopInfo.bind(this)
  }

  componentDidMount() {
    const {dispatch, route} = this.props
    dispatch(getUser(route.username))
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
        title={route.username}
        titleColor="white"
        style={s.toolbar} />
    )
  }

  renderTopInfo() {
    const {users, route} = this.props
    const user = users[route.userId]
    return (
      <View style={s.avatarContainer}>
        <Image
          source={{uri: user.avatarUrlMedium}} />
        <Text>{user.displayName}</Text>
      </View>
    )
  }


  render() {
    const {isLoadingUsers, route, users} = this.props
    if (isLoadingUsers || !users[route.userId]) {
      return (
        <View style={s.container}>
          {this.renderToolbar()}
          <Loading />
        </View>
      )
    }
    return (
      <View style={s.container}>
        {this.renderToolbar()}
        {this.renderTopInfo()}
      </View>
    )
  }
}

UserScreen.propTypes = {
  dispatch: PropTypes.func,
  isLoadingUsers: PropTypes.bool,
  users: PropTypes.object,
  route: PropTypes.object
}


function mapStateToProps(state) {
  const {current} = state.navigation
  const {isLoadingUsers} = state.users
  return {
    isLoadingUsers,
    route: current,
    users: state.users.entities
  }
}

export default connect(mapStateToProps)(UserScreen)
