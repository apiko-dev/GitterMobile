import randomId from './randomId'

export default function createMessage(user, text) {
  const temporaryId = randomId()
  return {
    sending: true,
    failed: false,
    id: `send-${temporaryId}`,
    text,
    sent: 'sending...',
    fromUser: user
  }
}
