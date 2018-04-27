const SQLite = require('react-native-sqlite-storage')
import { Location, ResultSet, Transaction } from 'react-native-sqlite-storage'

interface Field {
  name: string
  type: string
  options: string[]
}

interface TableOptions {
  name: string
  fields: Field[]
}

interface asyncTransaction {
  executeSql: (query: string, args?: any[]) => Promise<{result: ResultSet, transaction: Transaction}>
}

interface SQLiteDatabase {
  enablePromise: (flag: boolean) => void
  DEBUG: (flag: boolean) => void
  openDatabase: (args: {name: string, location: Location}) => Promise<SQLiteDatabase>
  close: (successCB: Function, errCB: Function) => Promise<void>
  transaction: (tx: Function) => Promise<ResultSet>
}

export class Storage {
  private sqlLite: SQLiteDatabase = SQLite
  private dbName = 'LocalSmartWalletData'
  private location: Location = 'default'

  constructor() {
    this.sqlLite.enablePromise(true)
    this.sqlLite.DEBUG(true)
  }

  private async getDbInstance() : Promise<SQLiteDatabase> {
    return await this.sqlLite.openDatabase({
      name: this.dbName,
      location: this.location
    })
  }

  async closeDB(db: SQLiteDatabase) : Promise<{}> {
    return new Promise((resolve, reject) => {
      return db.close(resolve, reject)
    })
  }

  async provisionTables() : Promise<void> {
    const tableData: TableOptions[] = dbHelper.defaultTables
    const db = await this.getDbInstance()

    await Promise.all(tableData.map(async t => await this.createTable(t, db)))
    await this.closeDB(db)
  }

  private async createTable(options : TableOptions, db: SQLiteDatabase) : Promise<void> {
    const query = dbHelper.assembleCreateTableQuery(options)
    await this.executeQuery(db, query)
  }

  private async executeQuery(db: SQLiteDatabase, query: string) : Promise<ResultSet> {
    return await db.transaction(async (tx: asyncTransaction) => {
      const response = await tx.executeSql(query, [])
      return response.result
    })
  }
}

const dbHelper = {
  defaultTables: [{
    name: 'Personas',
    fields: [{
      name: 'did',
      type: 'VARCHAR(20)',
      options: ['NOT NULL', 'UNIQUE', 'COLLATE NOCASE', 'PRIMARY KEY']
    }, {
      name: 'controllingKey',
      type: 'INTEGER',
      options: []
    }, {
      name: 'FOREIGN KEY(controllingKey)',
      type: 'REFERENCES Keys(id)',
      options: []
    }]
  }, {
    name: 'Keys',
    fields: [{
      name: 'id',
      type: 'INTEGER',
      options: ['PRIMARY KEY', 'NOT NULL', 'UNIQUE']
    }, {
      name: 'wif',
      type: 'VARCHAR(20)',
      options: ['UNIQUE', 'NOT NULL']
    }, {
      name: 'path',
      type: 'VARCHAR(10)',
      options: ['NOT NULL']
    }, {
      name: 'entropySource',
      type: 'INTEGER',
      options: []
    }, {
      name: 'algorithm',
      type: 'TEXT',
      options: ['NOT NULL']
    }, {
      name: 'FOREIGN KEY(entropySource)',
      type: 'REFERENCES MasterKeys(id)',
      options: []
    }]
  }],

  assembleCreateTableQuery: (options: TableOptions) : string => {
    const { name, fields } = options
    const st = `CREATE TABLE IF NOT EXISTS ${name}`

    const fieldSt = fields.map(f => {
      const { name, type, options } = f
      const fieldOptions = options.join(' ')
      return `${name} ${type} ${fieldOptions}`
    }).join(', ')
    return `${st} (${fieldSt})`
  }
}

