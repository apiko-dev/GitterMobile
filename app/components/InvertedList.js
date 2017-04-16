import React, {Component, PropTypes} from 'react'
import {VirtualizedList, View, StyleSheet, Flatlist} from 'react-native'
import _ from 'lodash'
import InvertibleScrollView from 'react-native-invertible-scroll-view'

const styles = StyleSheet.create({

})

class InvertedList extends Component {
  constructor(props) {
    super(props)

    this._renderItem = this._renderItem.bind(this)
    this._getItem = this._getItem.bind(this)

    this.state = {

    }
  }

  _getItem(data, index) {
    return data[index]
  }

  _keyExtractor(item, index) {
    return !!item && item.id ? item.id : index
  }

  _renderItem(item) {
    return (
      <View style={styles.item}>
        {this.props.renderItem(item)}
      </View>
    )
  }

  render() {
    const {
      data,
      initialNumToRender,
      onEndReached,
      onEndReachedThreshold,
      onViewableItemsChanged,
      windowSize
    } = this.props
    // debugger
    return (
      <VirtualizedList
        windowSize={windowSize}
        onEndReached={onEndReached}
        onEndReachedThreshold={onEndReachedThreshold}
        onViewableItemsChanged={onViewableItemsChanged}
        initialNumToRender={initialNumToRender}
        renderItem={this._renderItem}
        getItem={this._getItem}
        keyExtractor={this._keyExtractor}
        data={data}
        renderScrollComponent={props => <InvertibleScrollView inverted {...props} />} />
    )
  }
}

InvertedList.defaultProps = {
  initialNumToRender: 30
}

InvertedList.propTypes = {
  initialNumToRender: PropTypes.number,
  data: PropTypes.any,
  renderItem: PropTypes.func
}

export default InvertedList
