/**
 * Returns normalized data - ids and entities
 * @param response - json response
 */
export default function normalize(response) {
  const result = {
    ids: [],
    entities: {}
  }

  response.map(item => {
    result.ids.push(item.id)
    result.entities[[item.id]] = item
  })

  return result
}
