import React from 'react'
import {View, Text} from 'react-native'
import Loading from '../Loading'
import s from './styles'

const LoadingOverlay = ({text}) => (
  <View style={s.loadingContainer}>
    <View style={s.textContainer}>
      <Loading text={text} color="white" />
    </View>
  </View>
)

LoadingOverlay.propTypes = {

}

export default LoadingOverlay
