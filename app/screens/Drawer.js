import React, {
  Component,
  PropTypes,
  View,
  Text
} from 'react-native'
import {connect} from 'react-redux'
import s from '../styles/DrawerStyles'

class Drawer extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <View style={s.container}>
        <Text>DRAWER!</Text>
      </View>
    )
  }
}

Drawer.propTypes = {
  navigator: PropTypes.func.isRequired
}

function mapStateToProps(state) {
  return {
    viewer: state.viewer
  }
}

export default connect(mapStateToProps)(Drawer)
