const BASE_API_URL = 'https://api.github.com'

export function checkNewReleases() {
  return request('repos/terrysahaidak/GitterMobile/releases')
}

function request(endpoint) {
  return fetch(`${BASE_API_URL}/${endpoint}`).then(raw => raw.json())
}
