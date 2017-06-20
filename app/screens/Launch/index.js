import React, {Component} from 'react'
import {Text, Image, StatusBar} from 'react-native';
import s from './styles'
import {THEMES} from '../../constants'
const {colors} = THEMES.gitterDefault


export default class LaunchScreen extends Component {
  render() {
    return (
      <Image style={s.container}
        source={require('../../images/gitter-background.jpg')}>
        <StatusBar
          translucent
          barStyle="dark-content" />
        <Text style={s.logo}>
          Loading...
        </Text>
      </Image>
    )
  }
}

LaunchScreen.navigatorStyle = {
  navBarHidden: true,
  statusBarBlur: true,
  statusBarColor: colors.darkRed
}
