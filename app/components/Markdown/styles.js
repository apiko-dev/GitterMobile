import {StyleSheet, Platform} from 'react-native'
const iOS = Platform.OS === 'ios'

const styles = StyleSheet.create({
  codeBlock: {
    fontFamily: iOS ? 'Courier' : 'monospace'
  },
  codeBlockContainer: {
    backgroundColor: '#eeeeee',
    borderColor: '#dddddd',
    borderRadius: 3,
    borderWidth: 1,
    padding: 4
  },
  inlineCode: {
    backgroundColor: '#eeeeee',
    borderColor: '#dddddd',
    borderRadius: 3,
    borderWidth: 1,
    fontFamily: 'Courier',
    fontWeight: 'bold'
  },
  blockQuoteSection: {
    flexDirection: 'row'
  },
  blockQuoteSectionBar: {
    width: 3,
    height: null,
    backgroundColor: '#DDDDDD',
    marginRight: 15
  },
  heading: {
    fontWeight: '500'
  },
  heading1: {
    fontSize: 32
  },
  heading2: {
    fontSize: 24
  },
  heading3: {
    fontSize: 18
  },
  heading4: {
    fontSize: 16
  },
  heading5: {
    fontSize: 13
  },
  heading6: {
    fontSize: 11
  },
  image: {
    width: '30%',
    height: '30%',
  },
})

export default styles
