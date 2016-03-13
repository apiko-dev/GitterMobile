import React, {
  Component,
  PropTypes,
  ToolbarAndroid,
  TextInput,
  View,
  ScrollView,
  Text
} from 'react-native'
import {connect} from 'react-redux'
import ScrollableTabView from 'react-native-scrollable-tab-view';
import * as Navigation from '../modules/navigation'
import s from '../styles/SearchScreenStyles.js'
import {THEMES} from '../constants'
const {colors} = THEMES.gitterDefault

class SearchScreen extends Component {
  constructor(props) {
    super(props)

    this.renderToolbar = this.renderToolbar.bind(this)
    this.navigateBack = this.navigateBack.bind(this)
    this.handleActionPress = this.handleActionPress.bind(this)
    this.renderTabs = this.renderTabs.bind(this)

    this.state = {
      value: '',
      focused: false
    }
  }

  componentDidMount() {
    // dirty hack to get text input focus on mounting
    // it won't focus because of tab-view without delay
    // for some reasons
    setTimeout(() => this.refs.textInput.focus(), 500)
  }

  navigateBack() {
    const {dispatch} = this.props
    dispatch(Navigation.goBack())
  }

  handleActionPress(index) {
    if (index === 0) {
      this.setState({value: ''})
    }
  }

  renderToolbar() {
    const {value} = this.state
    const actions = !!value
      ? [{title: 'Clear', icon: require('image!ic_close_white_24dp'), show: 'always'}]
      : []

    return (
      <ToolbarAndroid
        navIcon={require('image!ic_arrow_back_white_24dp')}
        onIconClicked={this.navigateBack}
        actions={actions}
        onActionSelected={this.handleActionPress}
        style={s.toolbar}>
        <View style={s.toolbarContainer}>
          <TextInput
            ref="textInput"
            style={s.textInput}
            value={value}
            onFocus={() => this.setState({facused: true})}
            underlineColorAndroid={colors.raspberry}
            placeholderTextColor="white"
            onChange={(event) => this.setState({value: event.nativeEvent.text})}
            placeholder="Search" />
        </View>
      </ToolbarAndroid>
    )
  }

  renderTabs() {
    return (
      <View style={s.tabsContainer}>
        <ScrollableTabView
          initialPage={0}
          tabBarBackgroundColor={colors.raspberry}
          tabBarUnderlineColor="white"
          tabBarActiveTextColor="white"
          tabBarInactiveTextColor={colors.androidGray}
          style={s.tabs}>
          <Text tabLabel="Users">Users</Text>
          <Text tabLabel="Rooms">Rooms</Text>
        </ScrollableTabView>
    </View>
    )
  }

  render() {
    return (
      <View style={s.container}>
        {this.renderToolbar()}
        {this.renderTabs()}
      </View>
    )
  }
}

SearchScreen.propTypes = {
  dispatch: PropTypes.func
}

export default connect()(SearchScreen)
