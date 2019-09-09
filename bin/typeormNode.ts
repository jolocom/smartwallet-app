import tsconfig from '../tsconfig.json'
const compilerOptions = tsconfig.compilerOptions

// @ts-ignore
const baseUrl = compilerOptions.baseUrl || '.'
// @ts-ignore
const paths = compilerOptions.paths || { }

Object.assign(paths,{
  'typeorm/browser': [ 'node_modules/typeorm' ]
})

import { register } from 'tsconfig-paths'

// This will monkey patch node so that imports can support path mapping like
// typescript config does. This is used so that 'typeorm/browser' imports in the
// storage lib code get mapped to 'typeorm' directly (for node usage)
register({
  paths,
  baseUrl,
})

const ormconfig = require('../ormconfig.ts').default
// change type to 'sqlite' instead of 'react-native'
ormconfig.type = 'sqlite'
ormconfig.database = 'db.sqlite3'

if (process.env.TYPEORM_REPL) {
  // if we are running as a REPL

  // instantiate the storage backend
  const Storage = require('src/lib/storage/storage').Storage
  const storage = new Storage(ormconfig)
  const entities = require('src/lib/storage/entities')

  const replGlobalMerge = (function(gl) {
    return (toMerge: object) => Object.assign(gl, toMerge)
  })(global)

  // assign some useful shortcuts
  replGlobalMerge({
    storage,
    entities,
    s: storage,
    e: entities
  })

  // @ts-ignore
  const connPromise = global.storage.initConnection()
  connPromise.then(() => {
    // this doesn't work, presumably because it's async
    // but the funny thing is console.log(conn) at the end works
    // Yet on the repl there's no conn global.
    //
    // @mnzaki tried capturing the global object in a closure (as function
    // arguments and as a const alias) and it still didn't work
    //
    replGlobalMerge({
      // @ts-ignore
      conn: global.storage.connection
    })

    // @ts-ignore
    // console.log(conn)

    console.log(
      "s = storage = new Storage()\ne = entities = require('src/lib/storage/entities')"
    )
  })
}
