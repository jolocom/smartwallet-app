import fs from 'fs'
import { stringify as stringifyEnv } from 'envfile'
import shell from 'shelljs'

const cloneRepo = async (remote: string, repoName: string) => {
  return new Promise<string>((res, rej) => {
    const dir = shell.tempdir()
    shell.exec(
      `git clone ${remote}:${repoName} -b master ${dir}/${repoName}`,
      {},
      (code, stdout, stderr) => {
        if (code != 0) return rej(new Error(stderr))
        return res(`${dir}/${repoName}`)
      },
    )
  })
}

const catFile = async (path: string) => {
  return new Promise((res, rej) => {
    const dsn = shell.cat(path)
    if (dsn.stderr) rej(dsn.stderr)
    res(dsn.stdout)
  })
}

const writeEnv = async (data: object) => {
  const env = stringifyEnv(data)

  return new Promise((res, rej) => {
    fs.writeFile('.env', env, (err) => {
      if (err) rej(err)
      else res(undefined)
    })
  })
}

const main = async () => {
  const path = await cloneRepo('dev@hetz1.jolocom.io', 'common-secrets')
  const sentryDSN = await catFile(path + '/sentry/dsn.txt')
  const branchLiveKey = await catFile(path + '/branch/key-live.txt')

  await writeEnv({
    SENTRY_DSN: sentryDSN,
    BRANCH_LIVE_KEY: branchLiveKey,
  })
}

main()
