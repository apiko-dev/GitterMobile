import React from 'react'
import {Text} from 'react-native'
import s from './styles'

const renderCodespan = (matchingString, matches) => {
  let component
  matchingString.replace(/(^|[^\\])(`+)([^\r]*?[^`])\2(?!`)/gm,
  (wholeMatch, m1, m2, m3) => {
    let c = m3;
    c = c.replace(/^([ \t]*)/g, '');	// leading whitespace
    c = c.replace(/[ \t]*$/g, '');	// trailing whitespace
    component = (
      <Text> <Text style={s.codespan}>{c}</Text></Text>
    )
  })
  return component
}

export default renderCodespan
