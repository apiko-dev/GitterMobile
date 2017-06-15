import React, {PropTypes} from 'react'
import {Platform} from 'react-native'
import Image from 'react-native-transformable-image'
import s from './styles'
import navigationStyles from '../../styles/common/navigationStyles'

const TransformableImage = ({navigator, url}) => {
  const onNavigatorEvent = (event) => {
    if (event.type === 'NavBarButtonPress') {
      if (event.id === 'close') {
        navigator.dismissModal({
          animationType: 'slide-down'
        })
      }
    }
  }

  navigator.setOnNavigatorEvent(onNavigatorEvent)
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

  return <Image
    style={s.container}
    source={{uri: url}} />
}

TransformableImage.navigatorStyle = {
  ...navigationStyles
}

TransformableImage.propTypes = {
  navigator: PropTypes.object,
  url: PropTypes.string
}

export default TransformableImage
