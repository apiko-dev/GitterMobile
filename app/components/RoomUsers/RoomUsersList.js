import React, {
  Component,
  PropTypes,
  ListView,
  View
} from 'react-native'

import RoomUserItem from './RoomUserItem'

export default class RoomUsersList extends Component {
  constructor(props) {
    super(props)

    this.renderRow = this.renderRow.bind(this)
  }

  renderRow(rowData, rowId) {
    const {onItemPress, onUserItemPress} = this.props

    return (
      <RoomUserItem
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
      <ListView
        ref="listView"
        style={{flex: 1}}
        dataSource={listViewData.dataSource}
        onEndReached={this.props.onEndReached}
        scrollRenderAheadDistance={1000}
        onEndReachedThreshold={500}s
        pageSize={30}
        initialListSize={30}
        renderRow={(rowData, _, rowId) => this.renderRow(rowData, rowId)} />
    )
  }
}

RoomUsersList.propTypes = {
  listViewData: PropTypes.object,
  onItemPress: PropTypes.func,
  onEndReached: PropTypes.func,
  onUserItemPress: PropTypes.func
}
