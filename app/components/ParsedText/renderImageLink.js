import React from 'react'
import {Text, Image, PixelRatio} from 'react-native'

const renderImage = (matchingString, matches) => (
  <Text style={{color: 'red'}}>
    <Image
      source={{uri: matches[5]}}
      style={{
        width: PixelRatio.getPixelSizeForLayoutSize(100),
        height: PixelRatio.getPixelSizeForLayoutSize(100)
      }}
      resizeMode="contain" />
  </Text>
)


export default renderImage
