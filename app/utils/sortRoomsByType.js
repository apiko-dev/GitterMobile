export const sortRoomsByType = ({ids, entities}) => {
  const unread = []
  const repos = []
  const onetoone = []
  const orgs = []
  const channels = []
  const favoriteIds = []
  const hidden = []

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
      if (!!entity.lastAccessTime) {
        onetoone.push(entity)
      } else {
        hidden.push(entity)
      }
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
    favoriteIds,
    hidden
  }
}

export const categorize = (ids, entities) => {
  if (ids.length === 0 || Object.keys(entities).length === 0) {
    return null
  }

  const unread = []
  const orgs = []
  const channels = []
  const favoriteIds = []
  const hidden = []

  for (const id of ids) {
    const entity = entities[id]
    if (entity.roomMember === false) {
      continue
    }

    if (entity.hasOwnProperty('favourite') && entity.favourite !== null) {
      favoriteIds.push(entity.id)
    }
    if (entity.unreadItems !== 0) {
      unread.push(entity)
    } else if (entity.githubType === 'REPO') {
      channels.push(entity)
    } else if (entity.githubType === 'ONETOONE') {
      if (!entity.lastAccessTime || entity.lastAccessTime === null) {
        hidden.push(entity)
      } else {
        channels.push(entity)
      }
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
    orgs,
    channels,
    favoriteIds,
    hidden
  }
}
