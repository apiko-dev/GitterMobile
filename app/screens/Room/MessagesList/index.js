import PropTypes from 'prop-types'
import React, { Component } from 'react'
import {View, ScrollView} from 'react-native'
import _ from 'lodash'
import ListView from '../../../../libs/ListView/ExtendedListView'
import moment from 'moment'
import InvertibleScrollView from 'react-native-invertible-scroll-view'
import ScrollToTop from '../../../components/ScrollToTop'
import Message from '../Message'
import HistoryBegin from '../HistoryBegin'
import s from './styles'
import {THEMES} from '../../../constants'
const {colors} = THEMES.gitterDefault

export default class MessagesList extends Component {
  constructor(props) {
    super(props)

    this.renderRow = this.renderRow.bind(this)
    this.isCollapsed = this.isCollapsed.bind(this)
    this.handleOnLayout = this.handleOnLayout.bind(this)
    this.renderScrollComponent = this.renderScrollComponent.bind(this)
    this.onScroll = this.onScroll.bind(this)
    this.handleOffsetChange = _.debounce(this.handleOffsetChange.bind(this), 50)
    this.handleOnMessageLongPress = this.handleOnMessageLongPress.bind(this)

    this.state = {
      isScrollButtonVisible: false,
      offsetY: 0
    }

    this.childHeights = {}
  }

  onScroll(e) {
    const offsetY = e.nativeEvent.contentOffset.y
    const height = this.childHeights[0]
    const isScrollButtonVisible = offsetY > height && this.state.offsetY > offsetY

    this.handleOffsetChange(offsetY)

    if (this.state.isScrollButtonVisible !== isScrollButtonVisible) {
      this.setState({isScrollButtonVisible})
    }
  }

  handleOffsetChange(offsetY) {
    this.setState({offsetY})
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

    return rowData.fromUser.username === previousMessage.fromUser.username &&
      (currentDate.diff(previousDate, 'minutes') < 5 || dateNow.diff(previousDate, 'minutes') < 5)
  }

  handleOnLayout(e, rowId) {
    this.childHeights[+rowId] = e.nativeEvent.layout.height
  }

  handleOnMessageLongPress(...args) {
    if (this.props.editing) return
    this.props.onLongPress(...args)
  }

  renderRow(rowData, rowId) {
    const {onPress, onUsernamePress, onUserAvatarPress, editing} = this.props
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
        onLongPress={this.handleOnMessageLongPress}
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
    const {isScrollButtonVisible} = this.state

    if (!listViewData) {
      return <View style={s.rootStyle} />
    }

    return (
      <View style={s.rootStyle}>
        <ListView
          ref="listview"
          onScroll={this.onScroll}
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
          renderRow={(rowData, __, rowId) => this.renderRow(rowData, rowId)} />

        <ScrollToTop
          root={this}
          visible={isScrollButtonVisible}
          width={42}
          height={42}
          backgroundColor={colors.raspberry}
          bottom={12}
          right={12}
          icon="expand-more"
          iconSize={24} />
      </View>
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
  renderTopComponent: PropTypes.func,
  editing: PropTypes.bool
}
