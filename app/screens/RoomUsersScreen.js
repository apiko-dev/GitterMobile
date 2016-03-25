import React, {
  Component,
  PropTypes,
  View
} from 'react-native'
import s from '../styles/screens/RoomUsers/RoomUsersScreenStyles'
import {connect} from 'react-redux'

import * as Navigation from '../modules/navigation'

import CustomSearch from '../components/CustomSearch'

class RoomUsersScreen extends Component {
  constructor(props) {
    super(props)

    this.handleChange = this.handleChange.bind(this)
    this.handleBackPress = this.handleBackPress.bind(this)
    this.handleClearPress = this.handleClearPress.bind(this)
    this.renderSearch = this.renderSearch.bind(this)

    this.state = {
      value: ''
    }
  }

  handleChange(event) {
    this.setState({value: event.nativeEvent.text})
  }

  handleClearPress() {
    this.setState({value: ''})
  }

  handleBackPress() {
    const {dispatch} = this.props
    dispatch(Navigation.goBack())
  }

  renderSearch() {
    return (
      <CustomSearch
        ref="customSearch"
        value={this.state.value}
        onChange={this.handleChange.bind(this)}
        onBackPress={this.handleBackPress.bind(this)}
        onClearPress={this.handleClearPress.bind(this)} />
    )
  }

  render() {
    return (
      <View style={s.container}>
        {this.renderSearch()}

      </View>
    )
  }
}

RoomUsersScreen.propTypes = {
  dispatch: PropTypes.func
}

function mapStateToProps(state) {
  return state
}

export default connect(mapStateToProps)(RoomUsersScreen)
