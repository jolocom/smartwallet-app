import fetch from 'node-fetch';
import fs from 'fs';
import shell from 'shelljs'

const CURRENT_PATH = process.cwd();
const SECRETS_REPO = 'dev@hetz1.jolocom.io:poeditor-key'
const BASE_URL = 'https://api.poeditor.com/v2';
const API_KEY_LOCATION = `${CURRENT_PATH}/bin/poeditor-key/POEDITOR_TOKEN.txt`
const PROJECT_ID_LOCATION = `${CURRENT_PATH}/bin/poeditor-key/POEDITOR_SW2_PROJECT_ID.txt`

export enum Languages {
  en = 'en',
  de = 'de',
}

interface IResult  {
  [key: string]: {
    [key: string]: number
  }
}

export interface IResponse<T = IResult> {
  response: {
    status: string,
    code: string,
    message: string,
  },
  result: T
}

export const cloneSecrets = () => {
  return new Promise((res, rej) => {
    const keyExists = fs.existsSync(API_KEY_LOCATION);
    const idExists = fs.existsSync(PROJECT_ID_LOCATION);
    if(!keyExists || !idExists) {
      shell.cd(`${CURRENT_PATH}/bin`)
      shell.rm('-rf', `poeditor-key`)
      shell.exec(
        `git clone ${SECRETS_REPO} -b master`,
        {},
        (code, stdout, stderr) => {
          if (code != 0) return rej(new Error(stderr))
          return res(stdout)
        },
      )
    } else {
      res('Secrets are already present');
    }
  })
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


export const sendPostRequest = async <T = IResponse, >(path: string, params: Record<string, string>) => {
  try {
    const { apiKey, projectId } = await getPoeditorSecrets();
    const requestParams = new URLSearchParams({
      api_token: apiKey,
      id: projectId,
      ...params
    })
    const res = await fetch(`${BASE_URL}${path}`, {
      method: 'POST',
      body: requestParams.toString(),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
    return await res.json() as T;
  } catch(err) {
    console.error(err);
  }
}