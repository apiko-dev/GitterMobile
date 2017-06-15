import React, {Component, PropTypes} from 'react';
import {View, ListView, ScrollView, Text} from 'react-native';
import moment from 'moment'
import InvertibleScrollView from 'react-native-invertible-scroll-view'
import Message from '../Message'
import HistoryBegin from '../HistoryBegin'
import s from './styles'

export default class MessagesList extends Component {
  constructor(props) {
    super(props)

    this.renderRow = this.renderRow.bind(this)
    this.isCollapsed = this.isCollapsed.bind(this)
    this.handleOnLayout = this.handleOnLayout.bind(this)
    this.renderScrollComponent = this.renderScrollComponent.bind(this)

    this.childHeights = {}
  }

  isCollapsed(rowData, rowId) {
    const {listViewData: {data, rowIds}} = this.props
    const index = rowIds.indexOf(rowId)

    // if (index === 0) {
    //   return false
    // }

    const previousMessage = data[rowIds[index + 1]] // because it reverted

    if (!previousMessage || previousMessage.hasOwnProperty('hasNoMore')) {
      return false
    }

    const currentDate = moment(rowData.sent)
    const previousDate = moment(previousMessage.sent)
    const dateNow = moment()

    if (rowData.fromUser.username === previousMessage.fromUser.username &&
        (currentDate.diff(previousDate, 'minutes') < 5 || dateNow.diff(previousDate, 'minutes') < 5)
      ) {
      return true
    }

    return false
  }

  handleOnLayout(e, rowId) {
    this.childHeights[+rowId] = e.nativeEvent.layout.height
    // debugger
  }

  renderRow(rowData, rowId) {
    const {onPress, onLongPress, onUsernamePress, onUserAvatarPress} = this.props
    if (!!rowData.hasNoMore) {
      return (
        <HistoryBegin />
      )
    }

    const isCollapsed = this.isCollapsed(rowData, rowId)

    return (
      <Message
        onLayout={(e) => this.handleOnLayout(e, rowId)}
        onPress={onPress}
        rowId={rowId}
        isCollapsed={isCollapsed}
        onLongPress={onLongPress}
        onUsernamePress={onUsernamePress}
        onUserAvatarPress={onUserAvatarPress}
        {...rowData} />
    )
  }

  renderScrollComponent(props) {
    const {renderBottom, renderTop, renderBottomComponent, renderTopComponent} = this.props
    return (
      <ScrollView {...props}>
        {renderBottom && <View style={s.verticallyInverted}>{renderBottomComponent()}</View>}
        {props.children}
        {renderTop && <View style={s.verticallyInverted}>{renderTopComponent()}</View>}
      </ScrollView>
    )
  }

  render() {
    const {listViewData, onChangeVisibleRows} = this.props

    if (!listViewData) {
      return <View style={{flex: 1}} />
    }

    // debugger

    return (
      <ListView
        ref="listView"
        childSizes={this.childHeights}
        onChangeVisibleRows={(a, b) => onChangeVisibleRows(a, b)}
        renderScrollComponent={props => (
          <InvertibleScrollView
            {...props}
            inverted
            renderScrollComponent={this.renderScrollComponent}
            keyboardShouldPersistTaps="handled" />
        )}
        dataSource={listViewData.dataSource}
        onEndReached={this.props.onEndReached}
        scrollRenderAheadDistance={1000}
        onEndReachedThreshold={500}
        pageSize={14}
        initialListSize={14}
        renderRow={(rowData, _, rowId) => this.renderRow(rowData, rowId)} />
    )
  }
}

MessagesList.propTypes = {
  onPress: PropTypes.func,
  listViewData: PropTypes.object,
  dispatch: PropTypes.func,
  onEndReached: PropTypes.func,
  onLongPress: PropTypes.func,
  onUsernamePress: PropTypes.func,
  onUserAvatarPress: PropTypes.func,
  onChangeVisibleRows: PropTypes.func,
  renderBottom: PropTypes.bool,
  renderTop: PropTypes.bool,
  renderBottomComponent: PropTypes.func,
  renderTopComponent: PropTypes.func
}
