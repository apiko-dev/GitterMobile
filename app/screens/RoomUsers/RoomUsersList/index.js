import PropTypes from 'prop-types'
import React, { Component } from 'react'
import {ListView, View} from 'react-native';
import s from './styles'

import RoomUserItem from '../RoomUserItem'

export default class RoomUsersList extends Component {
  constructor(props) {
    super(props)

    this.renderRow = this.renderRow.bind(this)
  }

  renderRow(rowData, rowId) {
    const {onItemPress, onUserItemPress} = this.props

    return (
      <RoomUserItem
        key={rowData.id}
        onItemPress={onItemPress}
        onUserItemPress={onUserItemPress}
        {...rowData} />
    )
  }

  render() {
    const {listViewData} = this.props

    if (!listViewData) {
      return <View style={{flex: 1}} />
    }

    return (
      <View style={s.container}>
        <ListView
          ref="listView"
          style={{flex: 1}}
          dataSource={listViewData.dataSource}
          onEndReached={this.props.onEndReached}
          scrollRenderAheadDistance={1000}
          onEndReachedThreshold={500}
          keyboardShouldPersistTaps="handled"
          pageSize={30}
          initialListSize={30}
          renderRow={(rowData, _, rowId) => this.renderRow(rowData, rowId)} />
      </View>
    )
  }
}

RoomUsersList.propTypes = {
  listViewData: PropTypes.object,
  onItemPress: PropTypes.func,
  onEndReached: PropTypes.func,
  onUserItemPress: PropTypes.func
}
