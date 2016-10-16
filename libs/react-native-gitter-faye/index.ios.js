import { NativeModules } from 'react-native'

const noop = () => {}
const trueNoop = Promise.resolve(true)

const FayeGitter = {
  setAccessToken: noop,
  create: noop,
  logger: noop,
  connect: trueNoop,
  checkConnectionStatus: trueNoop,
  subscribe: noop,
  unsubscribe: noop
}

export default NativeModules.FayeManager
