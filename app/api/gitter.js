const apiUrl = 'https://api.gitter.im/v1'

export function currentUser(token) {
  return callApi('user', token)
}

export function currentUserRooms(token) {
  return callApi('rooms', token)
}

export function currentUserSuggested(token, id) {
  const endpoint = `user/${id}/suggestedRooms`
  return callApi(endpoint, token)
}

export function room(token, id) {
  return callApi('rooms/' + id, token)
}

export function roomMessages(token, id, limit) {
  return callApi(`rooms/${id}/chatMessages?limit=${limit}`, token)
}

export function roomMessagesBefore(token, id, limit, beforeId) {
  return callApi(`rooms/${id}/chatMessages?limit=${limit}&beforeId=${beforeId}`, token)
}

export function sendMessage(token, roomId, text) {
  return callApi(`/rooms/${roomId}/chatMessages`, token, {
    method: 'POST',
    body: JSON.stringify({
      text
    })
  })
}

export function joinRoom(token, uri) {
  return callApi(`/rooms`, token, {
    method: 'POST',
    body: JSON.stringify({
      uri
    })
  })
}

export function leaveRoom(token, roomId, userId) {
  return callApi(`/rooms/${roomId}/users/${userId}`, token, {
    method: 'DELETE'
  })
}

/**
 * Private functions
 */

function callApi(endpoint, token, options = {method: 'get'}) {
  const url = `${apiUrl}/${endpoint}`

  return fetch(url, {
    ...options,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  }).then(res => res.json())
}
// GET https://gitter.im/api/v1/user/555e610f15522ed4b3e0c169/suggestedRooms
// GET https://gitter.im/api/v1/repo-info?repo=dev-ua%2Freactjs
// DELETE https://gitter.im/api/v1/user/555e610f15522ed4b3e0c169/rooms/54774579db8155e6700d8cc6/unreadItems/all
// 56c37486e610378809c1c05a
// 56d730e2e610378809c4aab8
// DELETE https://gitter.im/api/v1/rooms/56d730e2e610378809c4aab8/users/555e610f15522ed4b3e0c169
