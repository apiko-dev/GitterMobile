const apiUrl = 'https://api.gitter.im/v1'
import {CLIENT_ID, CLIENT_SECRET, REDIRECT_URI} from '../local'

export const gitterLoginUrl = () => {
  const responseType = 'code'

  return `https://gitter.im/login/oauth/authorize?client_id=${CLIENT_ID}&response_type=${responseType}&redirect_uri=${REDIRECT_URI}`
}

export function getToken(code) {
  const params = {
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    code,
    redirect_uri: REDIRECT_URI,
    grant_type: 'authorization_code'
  }

  const body = Object.keys(params)
    .map(key => `${key}=${params[key]}`)
    .join('&')

  // debugger

  return fetch(`https://gitter.im/login/oauth/token`, {
    method: 'post',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body
  })
  .then(res => {
    console.log(res)
    return res.text()
  })
  .then(text => {
    // debugger
    if (text === 'OK') {
      return []
    }
    if (text.length === 0) {
      return []
    }
    return JSON.parse(text)
  })
}


/**
 * Authed user stuff
 */

export function me(token) {
  return callApi('user/me', token)
}

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

/**
 * Rooms resource
 */

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
  return callApi(`rooms/${roomId}/chatMessages`, token, {
    method: 'POST',
    body: JSON.stringify({
      text
    })
  })
}

export function sendStatusMessage(token, roomId, text) {
  return callApi(`rooms/${roomId}/chatMessages`, token, {
    method: 'POST',
    body: JSON.stringify({
      text,
      status: true
    })
  })
}

export function joinRoom(token, userId, roomId) {
  return callApi(`user/${userId}/rooms`, token, {
    method: 'POST',
    body: JSON.stringify({
      id: roomId
    })
  })
}

export function joinRoomByUserName(token, username) {
  return callApi('/rooms', token, {
    method: 'POST',
    body: JSON.stringify({
      uri: username
    })
  })
}

export function roomInfo(token, uri) {
  return callApi(`rooms`, token, {
    method: 'POST',
    body: JSON.stringify({
      uri
    })
  })
}

export function changeFavoriteStatus(token, userId, roomId, status) {
  return callApi(`user/${userId}/rooms/${roomId}`, token, {
    method: 'PUT',
    body: JSON.stringify({
      favourite: status
    })
  })
}

export function getNotificationSettings(token, userId, roomId) {
  return callApi(`user/${userId}/rooms/${roomId}/settings/notifications`, token)
}

export function changeNotificationSettings(token, userId, roomId, mode) {
  return callApi(`user/${userId}/rooms/${roomId}/settings/notifications`, token, {
    method: 'PUT',
    body: JSON.stringify({
      mode
    })
  })
}

export function leaveRoom(token, roomId, userId) {
  return callApi(`rooms/${roomId}/users/${userId}`, token, {
    method: 'DELETE'
  })
}

export function hideRoom(token, roomId, userId) {
  return callApi(`user/${userId}/rooms/${roomId}`, token, {
    method: 'DELETE'
  })
}

export function markAllAsRead(token, roomId, userId) {
  return callApi(`user/${userId}/rooms/${roomId}/unreadItems/all`, token, {
    method: 'DELETE'
  })
}

export function updateMessage(token, roomId, messageId, text) {
  return callApi(`rooms/${roomId}/chatMessages/${messageId}`, token, {
    method: 'PUT',
    body: JSON.stringify({
      text
    })
  })
}

export function searchUsers(token, query) {
  return callApi(`user?q=${query}&limit=10&type=gitter`, token)
}

export function searchRooms(token, query) {
  return callApi(`rooms?q=${query}&limit=10`, token)
}

export function searchUserRooms(token, id, query) {
  return callApi(`user/${id}/repos?q=${query}&limit=10`, token)
}

export function getUser(token, username) {
  return callApi(`users/${username}`, token)
}

export function getRepoInfo(token, repoName) {
  const url = `repo-info?repo=${repoName}`
  return fetch(`${apiUrl}/${url}`, {
    method: 'get',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })
}

export function getRoomUsers(token, roomId) {
  return callApi(`rooms/${roomId}/users`, token)
}

export function getRoomUsersWithSkip(token, roomId, skip) {
  return callApi(`rooms/${roomId}/users?skip=${skip}`, token)
}

export function searchRoomUsers(token, roomId, query) {
  return callApi(`rooms/${roomId}/users?q=${query}`, token)
}

export function addUserToRoom(token, roomId, username) {
  return callApi(`rooms/${roomId}/users`, token, {
    method: 'post',
    body: JSON.stringify({
      username
    })
  })
}

export function getMessage(token, roomId, messageId) {
  return callApi(`rooms/${roomId}/chatMessages/${messageId}`, token)
}

export function readMessages(token, userId, roomId, chat) {
  return callApi(`user/${userId}/rooms/${roomId}/unreadItems`, token, {
    method: 'post',
    body: JSON.stringify({
      chat
    })
  })
}

export function searchRoomMessages(token, roomId, query) {
  return callApi(`rooms/${roomId}/chatMessages?q=${query}&limit=30`, token)
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
  })
  .then(res => {
    // console.log(res)
    return res.text()
  })
  .then(text => {
    // debugger
    if (text === 'OK') {
      return []
    }
    if (text.length === 0) {
      return []
    }
    return JSON.parse(text)
  })
}
// GET https://gitter.im/api/v1/user/555e610f15522ed4b3e0c169/suggestedRooms
// GET https://gitter.im/api/v1/repo-info?repo=dev-ua%2Freactjs
// DELETE https://gitter.im/api/v1/user/555e610f15522ed4b3e0c169/rooms/54774579db8155e6700d8cc6/unreadItems/all
// 56c37486e610378809c1c05a
// 56d730e2e610378809c4aab8
// DELETE https://gitter.im/api/v1/rooms/56d730e2e610378809c4aab8/users/555e610f15522ed4b3e0c169
