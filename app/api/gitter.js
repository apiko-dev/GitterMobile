const apiUrl = 'https://api.gitter.im/v1'

export function currentUser(token) {
  return callApi('user', token).then(res => res.json())
}

export function currentUserRooms(token) {
  return callApi('rooms', token).then(res => res.json())
}

export function currentUserSuggested(token, id) {
  const endpoint = `user/${id}/suggestedRooms`
  return callApi(endpoint, token).then(res => res.json())
}

function callApi(endpoint, token, options = {method: 'get'}) {
  const url = `${apiUrl}/${endpoint}`

  return fetch(url, {
    ...options,
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
}
// https://gitter.im/api/v1/user/555e610f15522ed4b3e0c169/suggestedRooms
