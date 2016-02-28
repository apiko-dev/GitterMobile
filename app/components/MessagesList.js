import React, {
  Component,
  PropTypes,
  ListView,
  View,
  Text
} from 'react-native'

export default class MessagesList extends Component {
  componentWillMount() {

  }

  renderRow(rowData, rowId) {
    return (
      <Text>{rowData.text} -- {rowId}</Text>
      )
  }

  render() {
    const {listViewData} = this.props
    // return <Text>Test</Text>
    return (
      <ListView
        ref="listView"
        dataSource={listViewData.dataSource}
        pageSize={50}
        initialListSize={50}
        renderRow={(rowData, _, rowId) => this.renderRow(rowData, rowId)} />
    )
  }
}

MessagesList.propTypes = {
  listViewData: PropTypes.object,
  dispatch: PropTypes.func
}
