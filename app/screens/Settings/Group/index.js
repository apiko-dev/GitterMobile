import PropTypes from 'prop-types'
import React, { Children } from 'react'
import {View} from 'react-native';
import s from './styles'

import Heading from '../../../components/Heading'
import Divider from '../../../components/Divider'

const Group = ({
  heading,
  children
}) => (
  <View style={s.container}>
    <View style={s.headingContainer}>
      <Heading text={heading} />
    </View>

    <View style={s.items}>
      {Children.map(children, Item => (
        <View style={s.item}>
          {Item}
          <Divider />
        </View>
      ))}
    </View>
  </View>
)

Group.propTypes = {
  heading: PropTypes.string,
  children: PropTypes.array
}

export default Group
