import React, {
  Component,
  PropTypes,
  ListView,
  View,
  Text
} from 'react-native'
import InvertibleScrollView from 'react-native-invertible-scroll-view'
import Message from './Message'

export default class MessagesList extends Component {
  renderRow(rowData, rowId) {
    if (!!rowData.hasNoMore) {
      return (
        <Text>It's a verry beginning of this room messages.</Text>
      )
    }

    return (
      <Message {...rowData} />
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
        renderScrollComponent={props => <InvertibleScrollView {...props} inverted />}
        dataSource={listViewData.dataSource}
        onEndReached={this.props.onEndReached}
        scrollRenderAheadDistance={1000}
        onEndReachedThreshold={500}
        pageSize={30}
        initialListSize={30}
        renderRow={(rowData, _, rowId) => this.renderRow(rowData, rowId)} />
    )
  }
}

MessagesList.propTypes = {
  listViewData: PropTypes.object,
  dispatch: PropTypes.func,
  onEndReached: PropTypes.func
}
