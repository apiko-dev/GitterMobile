import React, {
  Component,
  PropTypes,
  ListView,
  View,
  Text
} from 'react-native'
import InvertibleScrollView from 'react-native-invertible-scroll-view'
import Message from './Message'
import HistoryBegin from './HistoryBegin'

export default class MessagesList extends Component {
  constructor(props) {
    super(props)

    this.renderRow = this.renderRow.bind(this)
  }

  renderRow(rowData, rowId) {
    const {onResendingMessage, onLongPress} = this.props
    if (!!rowData.hasNoMore) {
      return (
        <HistoryBegin />
      )
    }

    return (
      <Message
        onResendingMessage={onResendingMessage}
        rowId={rowId}
        onLongPress={onLongPress}
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
  onResendingMessage: PropTypes.func,
  listViewData: PropTypes.object,
  dispatch: PropTypes.func,
  onEndReached: PropTypes.func,
  onLongPress: PropTypes.func
}
