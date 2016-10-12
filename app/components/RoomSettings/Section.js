import React, {PropTypes} from 'react'
import {View} from 'react-native'
import Heading from '../Heading'

import s from '../../styles/screens/RoomSettings/Section'

const Section = ({title, children}) => (
  <View style={s.container}>
    <Heading text={title} />

    {children}
  </View>
)

Section.propTypes = {

}

export default Section
