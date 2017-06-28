import PropTypes from 'prop-types'
import React, { Component } from 'react'
import {TextInput, Text, View, Linking, ScrollView} from 'react-native';
import s from './styles'
import {connect} from 'react-redux'
import {checkToken} from '../../modules/auth'
import iconsMap from '../../utils/iconsMap'

import LoadingOverlay from '../../components/LoadingOverlay'
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
    dispatch(checkToken({token}, navigator))
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

  renderLoading() {
    return (
      <LoadingOverlay text="Checking token..." />
    )
  }

  render() {
    const {logining, errors, error} = this.props
    return (
      <View style={s.container}>
        <ScrollView>
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
          {error && <Text style={s.error}>{errors}</Text>}
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
        </ScrollView>

        {logining && this.renderLoading()}
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

function mapStateToProps(state) {
  const {logining, errors, error} = state.auth

  return {
    logining,
    errors,
    error
  }
}

export default connect(mapStateToProps)(LoginByTokenScreen)
