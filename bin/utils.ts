import fs from 'fs'
import { stringify as stringifyEnv, parse as parseEnv, Data } from 'envfile'
import shell from 'shelljs'

export const TMP_DIR = `${process.cwd()}/.tmp`

export const cloneRepo = async (remote: string, repoName: string) => {
  return new Promise<string>((res, rej) => {
    shell.mkdir(TMP_DIR)
    shell.rm('-rf', `${TMP_DIR}/${repoName}`)
    shell.exec(
      `git clone ${remote}:${repoName} -b master ${TMP_DIR}/${repoName}`,
      {},
      (code, stdout, stderr) => {
        if (code != 0) return rej(new Error(stderr))
        return res(`${TMP_DIR}/${repoName}`)
      },
    )
  })
}

export const catFile = async (path: string) => {
  return new Promise((res, rej) => {
    const dsn = shell.cat(path)
    if (dsn.stderr) rej(dsn.stderr)
    res(dsn.stdout)
  })
}

export const writeEnv = async (path: string, data: object) => {
  const env = stringifyEnv(data)

  return new Promise((res, rej) => {
    fs.writeFile(path, env, (err) => {
      if (err) rej(err)
      else res(undefined)
    })
  })
}

export const readEnv = async (path: string) => {
  return new Promise<Data>((res, rej) => {
    fs.readFile(path, 'utf8', (err, data) => {
      if (err) {
        console.log(
          '\x1b[4;31m%s\x1b[0m',
          'Error! Could not find the environmental config (.env).',
        )
      } else res(parseEnv(data))
    })
  })
}