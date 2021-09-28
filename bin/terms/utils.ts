import fetch from 'node-fetch'
import fs from 'fs'

const BASE_URL = 'https://api.poeditor.com/v2'
const API_KEY_LOCATION = `/tmp/common-secrets/poeditor/POEDITOR_TOKEN.txt`
const PROJECT_ID_LOCATION = `/tmp/common-secrets/poeditor/POEDITOR_SW2_PROJECT_ID.txt`

export enum Languages {
  en = 'en',
  de = 'de',
}

interface IResult {
  [key: string]: {
    [key: string]: number
  }
}

export interface IResponse<T = IResult> {
  response: {
    status: string
    code: string
    message: string
  }
  result: T
}

const readTextFile = (location: string) => {
  return new Promise<string>((res, rej) => {
    fs.readFile(location, 'utf8', (err, data) => {
      if (err) rej(err)
      else res(data.toString().trim())
    })
  })
}

const getPoeditorSecrets = async () => {
  const apiKey = await readTextFile(API_KEY_LOCATION)
  const projectId = await readTextFile(PROJECT_ID_LOCATION)
  return { apiKey, projectId }
}

export const sendPostRequest = async <T = IResponse>(
  path: string,
  params: Record<string, string>,
) => {
  try {
    const { apiKey, projectId } = await getPoeditorSecrets()
    const requestParams = new URLSearchParams({
      api_token: apiKey,
      id: projectId,
      ...params,
    })
    const res = await fetch(`${BASE_URL}${path}`, {
      method: 'POST',
      body: requestParams.toString(),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
    return (await res.json()) as T
  } catch (err) {
    console.error(err)
  }
}
