import {Platform} from 'react-native'
const iOS = Platform.OS === 'ios'

export const THEMES = {
  gitterDefault: {
    name: 'Gitter default theme',
    colors: {
      brand: '#E20354',

      sidebarBackground: '#383435',

      primaryButton: '#46bc99',
      secondaryButton: '#d6d6d6',

      green: '#1dce73',
      orange: '#ea9448',
      yellow: '#f1c40f',
      blue: '#3498db',
      red: '#e74c3c',
      purple: '#935991',

      mention: '#e67e22',
      unReadBackground: 'rgba(213,245,226,.8)',

      mainFont: '#333',
      secondaryFont: '#777',
      whiteFont: 'white',
      link: '#3498db',
      blockquoteBorder: '#eee',

      codeInlineBorder: 'rgba(192,201,200,.4)',
      codeInlineBackground: 'rgba(192,201,200,.2',

      darkRed: '#b70345',
      raspberry: '#E20354',
      white: '#ffffff',
      gray: '#E0E0E0',
      dark: '#424242',

      androidGray: '#f0eef0'
    }
  }
}

export const OLD_ANDROID_VERSIONS = ['4.4.4', '4.4.3', '4.4.2', '4.4.1', '4.4', '4.3.1', '4.3', '4.2.2', '4.2.1', '4.2', '4.1.2']

export const icons = {
  'menu': {icon: 'menu', color: 'black', size: 24},
  'menu-white': {icon: 'menu', color: 'white', size: 24},
  'search': {icon: 'search', color: 'black', size: 24},
  'search-white': {icon: 'search', color: 'white', size: 24},
  'more-vert': {icon: 'more-vert', color: 'white', size: 24},
  'info-outline': {icon: 'info-outline', color: 'white', size: 24},
  'back': {icon: iOS ? 'chevron-left' : 'arrow-back', color: 'white', size: 24},
  'forward': iOS ? {icon: 'chevron-right', color: 'white', size: 40} : {icon: 'arrow-forward', color: 'white', size: 24},
  'expand-more': {icon: 'expand-more', color: 'white', size: 24},
  'checkmark': {icon: 'check', color: 'white', size: 24},
  'browser': {icon: 'open-in-browser', color: 'white', size: 24},
  'closeIcon': {icon: 'close', color: 'white', size: 24}
}
