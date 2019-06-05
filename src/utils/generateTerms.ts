// executed by node.js

import strings from '../locales/strings'
import { writeFileSync } from 'fs'
const en = {}

Object.keys(strings)
  .sort()
  .map(key => (en[strings[key]] = strings[key]))

const path = __dirname + '/../locales/en.json'
writeFileSync(path, JSON.stringify(en), { flag: 'w' })
