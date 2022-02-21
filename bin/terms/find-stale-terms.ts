import minimist from 'minimist'
import fs from 'fs'
import shell from 'shelljs'
import { printHelp, purpleLog } from '../utils'

const LOGS_DIR = '.tmp'
const STALE_TERMS_FILE = 'stale-terms.txt'

const args = minimist(process.argv.slice(2), {
  string: ['path'],
  boolean: ['help', 'write'],
})
let path = args.path,
  write = args.write,
  help = args.help

if (help) {
  printHelp('yarn terms:stale --path=/path/to/translation.json --write', [
    ['path', true, 'file path to read terms from'],
    [
      'write',
      false,
      `will write stale term to ${LOGS_DIR}/${STALE_TERMS_FILE}`,
    ],
  ])
  process.exit(0)
}

try {
  fs.readFile(path, { encoding: 'utf8' }, (err, data) => {
    if (err) {
      throw err
    }
    const unusedTerms: string[] = []
    const translationObj = JSON.parse(data)
    purpleLog('Looking for stale terms...')
    for (let ctx of Object.keys(translationObj)) {
      for (let term of Object.keys(translationObj[ctx])) {
        const regexp = new RegExp(ctx + '.' + term)
        const result = shell.grep('-l', regexp, 'src/**/*.tsx', 'src/**/*.ts')
        if (!Boolean(result.toString().trim())) {
          unusedTerms.push(ctx + '.' + term)
        }
      }
    }
    purpleLog('Search complete')
    if (write) {
      purpleLog('Writing stale terms to a file')
      if (!fs.existsSync(LOGS_DIR)) {
        fs.mkdirSync(LOGS_DIR)
      }
      const stream = fs.createWriteStream(`${LOGS_DIR}/${STALE_TERMS_FILE}`)
      stream.once('open', function () {
        unusedTerms.forEach(function (term) {
          stream.write(term + '\n')
        })
        stream.end()
      })
    }
    return unusedTerms
  })
} catch (e) {
  console.error(e)
}
