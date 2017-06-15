import React, {PropTypes} from 'react'
import {Platform} from 'react-native'
import TransformableImage from 'react-native-transformable-image'
import s from './styles'

const TransformableImageView = ({navigator, url}) => {
  navigator.setTitle({title: 'Room settings'})
  navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this))
  navigator.setButtons(
    Platform.OS === 'ios'
      ? {
        leftButtons: [{
          title: 'Close',
          id: 'close',
          iconColor: 'white',
          showAsAction: 'always'
        }]
      }
      : {}
  )

  return <TransformableImage
    style={s.container}
    source={{uri: url}}/>
}

TransformableImage.propTypes = {
  navigator: PropTypes.object,
  url: PropTypes.string
}

export default TransformableImage
