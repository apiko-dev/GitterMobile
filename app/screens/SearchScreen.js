import React, {
  Component,
  PropTypes,
  ToolbarAndroid,
  TextInput,
  View,
  Text
} from 'react-native'
import {connect} from 'react-redux'
import * as Navigation from '../modules/navigation'
import s from '../styles/SearchScreenStyles.js'
import {THEMES} from '../constants'
const {colors} = THEMES.gitterDefault

class SearchScreen extends Component {
  constructor(props) {
    super(props)

    this.renderToolbar = this.renderToolbar.bind(this)
    this.navigateBack = this.navigateBack.bind(this)

    this.state = {
      value: ''
    }
  }

  componentDidMount() {
    this.refs.textInput.focus()
  }

  navigateBack() {
    const {dispatch} = this.props
    dispatch(Navigation.goBack())
  }

  renderToolbar() {
    const {value} = this.state
    return (
      <ToolbarAndroid
        navIcon={require('image!ic_menu_white_24dp')}
        onIconClicked={this.navigateBack}
        style={s.toolbar}>
        <View style={s.toolbarContainer} >
          <TextInput
            ref="textInput"
            style={s.textInput}
            value={value}
            underlineColorAndroid={colors.raspberry}
            placeholderTextColor="white"
            onChange={(event) => this.setState({value: event.nativeEvent.text})}
            placeholder="Search" />
        </View>
      </ToolbarAndroid>
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

SearchScreen.propTypes = {
  dispatch: PropTypes.func
}

export default connect()(SearchScreen)
