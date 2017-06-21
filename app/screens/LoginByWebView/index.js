import PropTypes from 'prop-types'
import React, { Component } from 'react'
import {
  WebView,
  Image,
  Text,
  View
} from 'react-native'
import {connect} from 'react-redux'

import Loading from '../../components/Loading'

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
      <View style={s.loadingContainer}>
        <Loading />
        <Text style={s.logo}>
          Signing in...
        </Text>
      </View>
    )
  }

  render() {
    const {loading} = this.state
    return (
      <Image style={s.container}
        source={require('../../images/gitter-background.jpg')}>
        {loading
          ? (
            this.renderLoading()
          ) : (
            <WebView
              style={{flex: 1}}
              automaticallyAdjustContentInsets
              domStorageEnabled
              javaScriptEnabled
              onNavigationStateChange={this.handleNavigationStateChange}
              source={{uri: gitterLoginUrl()}} />
          )
        }
      </Image>
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
