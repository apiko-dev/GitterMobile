const sortRoomsByType = ({ids, entities}) => {
  const unread = []
  const repos = []
  const onetoone = []
  const orgs = []
  const channels = []
  const favoriteIds = []

  for (const id of ids) {
    const entity = entities[id]
    if (entity.unreadItems !== 0) {
      unread.push(entity)
    }
    if (!!entity.favourite) {
      favoriteIds.push(entity.id)
    }
    if (entity.githubType === 'REPO') {
      repos.push(entity)
    } else if (entity.githubType === 'ONETOONE') {
      onetoone.push(entity)
    } else if (entity.githubType === 'ORG') {
      orgs.push(entity)
    } else if (entity.githubType === 'ORG_CHANNEL' ||
      entity.githubType === 'REPO_CHANNEL' ||
      entity.githubType === 'USER_CHANNEL') {
      channels.push(entity)
    } else {
      console.log('Unknow room: ', entity)
    }
  }

  return {
    unread,
    repos,
    onetoone,
    orgs,
    channels,
    favoriteIds
  }
}

export default sortRoomsByType
