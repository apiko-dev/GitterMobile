import React, {
  Component,
  PropTypes,
  View,
  Text
} from 'react-native'
import {connect} from 'react-redux'
import s from '../styles/DrawerStyles'
import DrawerUserInfo from '../components/DrawerUserInfo'

class Drawer extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const {user} = this.props
    return (
      <View style={s.container}>
        <DrawerUserInfo {...user}/>
      </View>
    )
  }
}

Drawer.propTypes = {
  navigator: PropTypes.func.isRequired,
  user: PropTypes.object
}

function mapStateToProps(state) {
  return {
    user: state.viewer.user
  }
}

export default connect(mapStateToProps)(Drawer)
