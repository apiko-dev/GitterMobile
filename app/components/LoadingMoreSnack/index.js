import PropTypes from 'prop-types'
import React from 'react'
import {ProgressBarAndroid, View, Text} from 'react-native';
import s from './styles'
import {THEMES} from '../../constants'
const {colors} = THEMES.gitterDefault

const LoadingMoreSnack = ({loading}) => {
  if (loading) {
    return (
      <View style={s.progressBar}>
        <ProgressBarAndroid
          styleAttr="Horizontal"
          color="white" />
      </View>
    )
  }

  return (
    <View style={[s.container, s.info]}>
      <Text style={s.text}>Loading...</Text>
    </View>
  )
}

LoadingMoreSnack.propTypes = {
  loading: PropTypes.bool
}

export default LoadingMoreSnack
