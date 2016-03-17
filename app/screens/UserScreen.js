import React, {
  Component,
  PropTypes,
  ToolbarAndroid,
  Text,
  View
} from 'react-native'
import {connect} from 'react-redux'
import s from '../styles/UserScreenStyles'
import * as Navigation from '../modules/navigation'

import Loading from '../components/Loading'

class UserScreen extends Component {
  constructor(props) {
    super(props)
    this.renderToolbar = this.renderToolbar.bind(this)
    this.navigateBack = this.navigateBack.bind(this)
  }

  navigateBack() {
    const {dispatch} = this.props
    dispatch(Navigation.goBack())
  }

  renderToolbar() {
    return (
      <ToolbarAndroid
        navIcon={require('image!ic_arrow_back_white_24dp')}
        onIconClicked={this.navigateBack}
        title="Test"
        titleColor="white"
        style={s.toolbar} />
    )
  }


  render() {
    return (
      <View style={s.container}>
        {this.renderToolbar()}
      </View>
    )
  }
}

UserScreen.propTypes = {
  dispatch: PropTypes.func,
  users: PropTypes.object,
  route: PropTypes.object
}


function mapStateToProps(state) {
  const {current} = state.navigation

  return {
    route: current
    // users: state.users.entities
  }
}

export default connect(mapStateToProps)(UserScreen)
