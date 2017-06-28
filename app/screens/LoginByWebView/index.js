import PropTypes from 'prop-types'
import React, { Component } from 'react'
import {
  WebView,
  View
} from 'react-native'
import {connect} from 'react-redux'

import LoadingOverlay from '../../components/LoadingOverlay'

import {THEMES} from '../../constants'
const {colors} = THEMES.gitterDefault

import s from './styles'
import {loginByToken} from '../../modules/auth'
import {gitterLoginUrl} from '../../api/gitter'

class LoginByWebView extends Component {
  constructor(props) {
    super(props)

    this.handleNavigationStateChange = this.handleNavigationStateChange.bind(this)

    this.state = {
      url: '',
      loading: false
    }
  }


  handleNavigationStateChange(state) {
    if (state.url !== this.state.url) {
      if (state.url.indexOf('gittermobile://code') !== -1 &&
        state.url.indexOf('https://gitter.im') === -1) {
        const {dispatch} = this.props
        const code = state.url.split('gittermobile://code?code=')[1]
        this.setState({url: state.url, loading: true})
        dispatch(loginByToken({code}))
      } else {
        this.setState({url: state.url})
      }
    }
  }

  renderLoading() {
    return (
      <LoadingOverlay text="Signing in..." />
    )
  }

  render() {
    const {loading} = this.state
    return (
      <View style={s.container}>
        <WebView
          style={{flex: 1}}
          automaticallyAdjustContentInsets
          domStorageEnabled
          javaScriptEnabled
          onNavigationStateChange={this.handleNavigationStateChange}
          source={{uri: gitterLoginUrl()}} />
        {loading && this.renderLoading()}
      </View>
    )
  }
}

LoginByWebView.propTypes = {
  dispatch: PropTypes.func
}

LoginByWebView.navigatorStyle = {
  navBarBackgroundColor: colors.raspberry,
  navBarButtonColor: 'white',
  navBarTextColor: 'white',
  topBarElevationShadowEnabled: true,
  statusBarColor: colors.darkRed,
  statusBarTextColorScheme: 'dark'
}

export default connect()(LoginByWebView)
