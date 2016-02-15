import React, {
  Component,
  PropTypes,
  ScrollView,
  ToolbarAndroid,
  Text,
  View
} from 'react-native'

import s from '../styles/HomeStyles'
import {THEMES} from '../constants'

const {colors} = THEMES.gitterDefault

export default class HomeScreen extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
  }

  render() {
    return (
      <View style={s.container}>
        <ToolbarAndroid
          actions={[{title: 'Search', icon: require('image!ic_search_white_24dp'), show: 'always'}]}
          navIcon={require('image!ic_menu_white_24dp')}
          onIconClicked={this.props.onMenuTap}
          title="Home"
          titleColor="white"
          style={[s.toolbar, {backgroundColor: colors.green}]} />

        <ScrollView contentContainerStyle={s.scrollContainer}>
          <View style={s.heading}>
            <Text style={s.welcome}>
            Welcome to React Native!
            </Text>
          </View>
          <Text style={s.instructions}>
            To get started, edit index.android.js
          </Text>
          <Text style={s.instructions}>
            Shake or press menu button for dev menu
          </Text>
        </ScrollView>
      </View>
    )
  }
}

HomeScreen.propTypes = {
  onMenuTap: PropTypes.func.isRequired,
  suggestedRooms: PropTypes.array,
  favorites: PropTypes.array
}
