import { GITTER_REGEXPS } from '../constants'

const { baseUrl, groupParamsExp, messageParamsExp, roomParamsExp } = GITTER_REGEXPS

export const parseGitterRoomUrl = (url) => {
  const [, ownerName, roomName] = roomParamsExp.exec(url.replace(baseUrl, ''))

  return {
    ownerName,
    roomName
  }
}

export const parseGitterGroupUrl = (url) => {
  const [, groupName] = groupParamsExp.exec(url.replace(baseUrl, ''))

  return {
    groupName
  }
}

export const parseGitterMessageUrl = (url) => {
  const [, atParam, roomName] = messageParamsExp.exec(url.replace(baseUrl, ''))

  return {
    atParam,
    roomName
  }
}
