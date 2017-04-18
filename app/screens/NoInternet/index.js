import React, {Component, PropTypes} from 'react';
import {Text, Image} from 'react-native';
import Button from '../../components/Button'
import {connect} from 'react-redux'
import s from './styles'
import * as Navigation from '../../modules/navigation'
import {THEMES} from '../../constants'
import {init} from '../../modules/app'
const {colors} = THEMES.gitterDefault

class NoInternetScreen extends Component {
  constructor(props) {
    super(props)

    this.handleRetry = this.handleRetry.bind(this)
  }

  handleRetry() {
    const {dispatch} = this.props
    dispatch(Navigation.resetTo({name: 'launch'}))
    dispatch(init())
  }

  render() {
    return (
      <Image style={s.container}
        source={require('../../images/gitter-background.jpg')}>

        <Text style={s.logo}>
          No internet connection.
        </Text>

        <Button
          style={[s.buttonStyle, {backgroundColor: colors.darkRed}]}
          onPress={() => this.handleRetry()}>
          <Text pointerEvents="none"
            style={s.buttonText}>
            Retry
          </Text>
        </Button>
      </Image>
    )
  }
}

NoInternetScreen.propTypes = {
  dispatch: PropTypes.func
}

export default connect()(NoInternetScreen)
