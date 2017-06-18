import React from 'react'
import {Text} from 'react-native'
import s from './styles'

const renderLink = (matchingString, matches) => {
  console.log(matches)
  const name = matches[1]
  return (
    <Text style={s.url}>{name}</Text>
  )
}

export default renderLink
