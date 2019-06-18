import strings from '../src/locales/strings'
import { writeFileSync } from 'fs'

const en = {}

Object.keys(strings)
  .sort()
  .forEach(key => (en[strings[key]] = strings[key]))

const path = __dirname + '/../src/locales/en.json'
writeFileSync(path, JSON.stringify(en, null, 2), { flag: 'w' })
