import PropTypes from 'prop-types'
import React, { Component } from 'react'
import {TextInput, Text, View, Linking} from 'react-native';
import s from './styles'
import {connect} from 'react-redux'
import {loginByToken} from '../../modules/auth'
import iconsMap from '../../utils/iconsMap'

import Button from '../../components/Button'
import {THEMES} from '../../constants'
const {colors} = THEMES.gitterDefault

class LoginByTokenScreen extends Component {
  constructor(props) {
    super(props)
    this.handleLogin = this.handleLogin.bind(this)
    this.handleChangeText = this.handleChangeText.bind(this)

    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this))

    this.state = {
      token: ''
    }
  }

  onNavigatorEvent(event) {
    if (event.type === 'NavBarButtonPress') {
      if (event.id === 'submit') {
        this.handleLogin()
      }
    }
  }

  handleLogin() {
    const {dispatch, navigator} = this.props
    const {token} = this.state
    if (!token.trim()) {
      return
    }
    dispatch(loginByToken({token}, navigator))
  }

  handleChangeText(e) {
    let rightButtons = []
    if (e.nativeEvent.text.trim().length) {
      rightButtons = [{
        title: 'Submit',
        id: 'submit',
        icon: iconsMap.checkmark,
        showAsAction: 'always'
      }]
    }
    this.props.navigator.setButtons({rightButtons})
    this.setState({token: e.nativeEvent.text.trim()})
  }

  render() {
    return (
      <View style={s.container}>
        <View style={s.textfieldContainer}>
          <TextInput
            disableFullscreenUI
            autoCorrect={false}
            spellCheck={false}
            value={this.state.token}
            placeholder="Paste token here..."
            placeholderTextColor={colors.raspberry}
            style={s.textfield}
            underlineColorAndroid="white"
            onChange={this.handleChangeText} />
        </View>
        <View style={s.hintContainer}>
          <Text style={s.hint}>
            To get your authentication token press "Get token" button. It will open developer.gitter.im site in your browser.{'\n'}{'\n'}After signing in you will see caption "Personal Access Token". Below that caption will be your access token.{'\n'}{'\n'}Copy it and paste inside text input. Then press check mark.
          </Text>
        </View>
        <View style={s.buttonContainer}>
          <Button
            rippleColor={colors.raspberry}
            style={[s.buttonStyle, {backgroundColor: colors.raspberry}]}
            onPress={() => Linking.openURL('https://developer.gitter.im/login')}>
            <Text pointerEvents="none"
              style={s.buttonText}>
              Get token
            </Text>
          </Button>
        </View>
      </View>
    )
  }
}

LoginByTokenScreen.navigatorStyle = {
  navBarBackgroundColor: colors.raspberry,
  navBarButtonColor: 'white',
  navBarTextColor: 'white',
  topBarElevationShadowEnabled: true,
  statusBarColor: colors.darkRed,
  statusBarTextColorScheme: 'dark'
}

LoginByTokenScreen.propTypes = {
  dispatch: PropTypes.func
}

export default connect()(LoginByTokenScreen)
