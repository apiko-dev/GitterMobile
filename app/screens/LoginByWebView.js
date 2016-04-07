import React, {
  Component,
  PropTypes,
  WebView,
  Dimensions
} from 'react-native'
// import s from '../styles/screens/Login/LoginByWebViewStyles'
import {connect} from 'react-redux'
import {loginByWebView} from '../modules/auth'

import {THEMES} from '../constants'
const {colors} = THEMES.gitterDefault

import {gitterLoginUrl} from '../api/gitter'

const jsForInjection = `
  var el = document.getElementsByTagName('body')[0];
  el.style.height = '${Dimensions.get('window').height}px';
`

class LoginByWebView extends Component {
  constructor(props) {
    super(props)

    this.handleNavigationStateChange = this.handleNavigationStateChange.bind(this)

    this.state = {
      token: '',
      url: ''
    }
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextState.url.indexOf('gittermobile://code?code=') !== -1) {
      this.props.dispatch(loginByWebView(nextState.url.split('gittermobile://code?code=')[1]))
    }
  }

  handleNavigationStateChange(state) {
    if (state.url !== this.state.url) {
      this.setState({url: state.url})
    }
  }

  render() {
    return (
      <WebView
        style={{flex: 1}}
        ref="webViewAndroidSample"
        automaticallyAdjustContentInsets
        domStorageEnabled
        javaScriptEnabled
        injectedJavaScript={jsForInjection}
        onNavigationStateChange={this.handleNavigationStateChange}
        source={{uri: gitterLoginUrl()}} />
    )
  }
}

LoginByWebView.propTypes = {
  dispatch: PropTypes.func
}

export default connect()(LoginByWebView)
