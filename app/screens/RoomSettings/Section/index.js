import PropTypes from 'prop-types'
import React from 'react'
import {View} from 'react-native'
import Heading from '../../../components/Heading'

import s from './styles'

const Section = ({title, children}) => (
  <View style={s.container}>
    <Heading text={title} />

    {children}
  </View>
)

Section.propTypes = {

}

export default Section
