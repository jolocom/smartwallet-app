import fs from 'fs'
import { stringify as stringifyEnv, parse as parseEnv, Data } from 'envfile'
import shell from 'shelljs'
import { Table } from 'console-table-printer'

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

// Script usage
type Documentation = [arg: string, isRequired: string | boolean, desc: string]

export function printHelp(gist: string, documentation: Documentation[]) {
  const helpEnhancedDocs = [...documentation, ['help', '--', 'prints help']]
  const t = new Table({
    columns: [
      {
        name: 'arg',
        title: 'Argument',
        alignment: 'right',
      },
      {
        name: 'isRequired',
        title: '*',
        alignment: 'right',
      },
      {
        name: 'desc',
        title: 'Description',
        alignment: 'left',
      },
    ],
  })

  purpleLog('Script usage:')
  console.log(`$ ${gist}`)
  helpEnhancedDocs.forEach((a) => {
    t.addRow({
      arg: `--${a[0]}`,
      isRequired:
        typeof a[1] === 'boolean' ? (a[1] ? '(required)' : '(optional)') : a[1],
      desc: a[2],
    })
  })
  t.printTable()
}

// Color the output
const coloredLog = (escapeSequence: string) => (message: string) =>
  console.log(escapeSequence, message)
export const purpleUnderlineLog = coloredLog('\x1b[4;95m%s\x1b[0m')
export const purpleLog = coloredLog('\x1b[0;95m%s\x1b[0m')
