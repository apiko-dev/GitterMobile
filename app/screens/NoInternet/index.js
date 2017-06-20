import PropTypes from 'prop-types'
import React, { Component } from 'react'
import {Text, Image} from 'react-native';
import Button from '../../components/Button'
import {connect} from 'react-redux'
import s from './styles'
import {THEMES} from '../../constants'
import {init} from '../../modules/app'
const {colors} = THEMES.gitterDefault
import {rootNavigator} from '../index'

class NoInternetScreen extends Component {
  constructor(props) {
    super(props)

    this.handleRetry = this.handleRetry.bind(this)
  }

  handleRetry() {
    const {dispatch} = this.props
    rootNavigator.startAppWithScreen({screen: 'gm.Launch'})
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
