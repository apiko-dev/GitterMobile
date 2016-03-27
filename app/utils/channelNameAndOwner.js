export default function channelNameAndOwner(str) {
  const [owner, name] = str.split(/\/(.*)/)
  return {owner, name}
}
