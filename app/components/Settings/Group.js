import React, {Children, PropTypes} from 'react';
import {View} from 'react-native';
import s from '../../styles/screens/Settings/Group'

import Heading from '../Heading'
import Divider from '../Divider'

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
