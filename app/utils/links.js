export const createGhAvatarLink = (name, size = 40) => {
  return `https://avatars.githubusercontent.com/${name}?v=3&size=${size}`
}

export function quoteLink(time, url, id) {
  return `:point_up: [${time}](https://gitter.im${url}?at=${id})`
}
