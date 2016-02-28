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
  componentWillMount() {

  }

  renderRow(rowData, rowId) {
    return (
      <Message {...rowData} />
    )
  }

  render() {
    const {listViewData} = this.props
    // return <Text>Test</Text>
    return (
      <ListView
        ref="listView"
        renderScrollComponent={props => <InvertibleScrollView {...props} inverted />}
        dataSource={listViewData.dataSource}
        onEndReached={this.props.onEndReached}
        onEndReachedThreshold={200}
        pageSize={50}
        initialListSize={50}
        renderRow={(rowData, _, rowId) => this.renderRow(rowData, rowId)} />
    )
  }
}

MessagesList.propTypes = {
  listViewData: PropTypes.object,
  dispatch: PropTypes.func,
  onEndReached: PropTypes.func
}
