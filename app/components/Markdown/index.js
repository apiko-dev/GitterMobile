import React, {Component, createElement} from 'react'
import {
  View,
  Text,
  ScrollView,
  Image
} from 'react-native'
import styles from './styles'
import MarkdownView from 'react-native-markdown-view/MarkdownView'
import SimpleMarkdown from 'simple-markdown'

class Markdown extends Component {
  getRules() {
    return {
      fence: {
        match: (source, state) => (null)
      },
      codeBlock: {
        match: SimpleMarkdown.blockRegex(/^`{3}([\S]+)?\n([\s\S]+)\n`{3}/),
        parse: (capture, parse, state) => {
          return {
            lang: capture[1],
            content: capture[2]
          }
        },
        render: (node, output, state) => {
          // debugger
          state.withinText = true
          const codeElement = createElement(Text, {
            key: state.key,
            style: styles.codeBlock
          }, node.content)
          const scrollElement = createElement(ScrollView, {
            horizontal: true,
            key: state.key
          }, codeElement)
          return createElement(View, {
            key: state.key,
            style: styles.codeBlockContainer
          }, scrollElement)
        }
      },
      inlineCode: {
        match: (source, state) => {
          const match = /^\`([^`]+)\`/.exec(source)

          if (!!match) {
            const newLineMatch = /\n/.exec(match[0])
            if (!!newLineMatch) return null
          }

          return match
        },
        parse: (capture, parse, state) => {
          // debugger
          return {
            content: capture[1]
          }
        },
        render: (node, output, state) => {
          state.withinText = true
          return createElement(Text, {
            key: state.key,
            style: styles.inlineCode
          }, node.content)
        }
      },
      blockQuote: {
        render: (node, output, state) => {
          state.withinText = true
          const blockBar = createElement(View, {
            key: state.key,
            style: [styles.blockQuoteSectionBar, styles.blockQuoteBar]
          })
          const blockText = createElement(View, {
            key: state.key + 1,
            style: styles.blockQuoteText
          }, output(node.content, state))
          return createElement(View, { key: state.key, style: [styles.blockQuoteSection, styles.blockQuote] }, [blockBar, blockText])
        }
      },
      heading: {
        match: (source, state) => {
          return /^ *(#{1,6}) *([^\n]+?) *#* *(?:\n *)/.exec(source)
        },
        render: (node, output, parentState) => {
          const state = {...parentState}
          state.withinText = true
          const stylesToApply = [styles.heading, styles['heading' + node.level]]
          state.stylesToApply = stylesToApply
          return createElement(Text, {
            key: state.key,
            style: stylesToApply
          }, output(node.content, state))
        }
      },
      // image: {
      //   render: (node, output, state) => {
      //     state.inline = false
      //     return createElement(Image, {
      //       key: state.key,
      //       resizeMode: styles.resizeMode ? styles.resizeMode : 'contain',
      //       source: { uri: node.target },
      //       style: node.target.match(/youtu|vimeo/) ? styles.video : styles.image
      //     })
      //   }
      // },
    }
  }
  render() {
    return (
      <MarkdownView
        rules={this.getRules()}>
        {this.props.children}
      </MarkdownView>
    )
  }
}

Markdown.propTypes = {

}

export default Markdown
