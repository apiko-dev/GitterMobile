import PropTypes from 'prop-types'
import React, { Component } from 'react'
import {View, Text} from 'react-native';
import s from './styles'
import ParsedText from '../../../components/ParsedText'
import Heading from '../../../components/Heading'
import Divider from '../../../components/Divider'

import moment from 'moment'

class Activity extends Component {
  constructor(props) {
    super(props)

    this.renderItem = this.renderItem.bind(this)
    this.renderList = this.renderList.bind(this)
  }

  renderList() {
    const {data} = this.props
    const lastIndex = data.length - 1
    return (
      <View style={s.listContainer}>
        {data.map((item, index) => {
          const bottom = lastIndex !== index
          return this.renderItem(item, bottom)
        })}
      </View>
    )
  }

  renderItem(item, bottom) {
    const {onUrlPress} = this.props
    return (
      <View key={item.id}>
        <View style={s.itemContainer}>
          <ParsedText
            styles={s.itemContainer}
            text={item.text}
            handleUrlPress={url => onUrlPress(url)} />
          <Text>{this.renderDate(item.sent)}</Text>
      </View>
        {bottom && <Divider />}
      </View>
    )
  }

  renderDate(sent) {
    const now = moment()
    const date = moment(sent)
    if (now.year() > date.year()) {
      return date.format('YYYY MMM D HH:mm')
    }

    if (now.diff(date, 'hours') > 24) {
      return date.format('MMM D HH:mm')
    }

    return date.format('HH:mm')
  }

  render() {
    const {data} = this.props
    if (!data) {
      return null
    }

    return (
      <View style={s.container}>
        <Heading
          text="Activity" />
        {data.length === 0
          ? <Text style={s.nothing}>Nothing to display</Text>
          : this.renderList()
        }
      </View>
    )
  }
}

Activity.propTypes = {
  data: PropTypes.array,
  onUrlPress: PropTypes.func
}

export default Activity
