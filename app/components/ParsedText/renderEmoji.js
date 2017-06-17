import React from 'react'
import Emoji from '../Emoji'

const renderEmoji = (matchingString, matches) => {
  const name = matches[0].replace(/:/g, '')
  return (
    <Emoji name={name} />
  )
}

export default renderEmoji
