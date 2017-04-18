import React from 'react'
import Emoji from '../../../components/Emoji'

const renderEmoji = (matchingString, matches) => {
  const name = matches[0].replace(/:/, '')
  return (
    <Emoji name={name} />
  )
}

export default renderEmoji
