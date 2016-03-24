export default function channelNameAndOwner(str) {
  const arr = str.split(/\/(.*)/)
  return {
    owner: arr[0],
    name: arr[1]
  }
}
