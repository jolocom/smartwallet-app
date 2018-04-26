const SQLite = require('react-native-sqlite-storage')

// TODO THROW ERRORS! & ERROR HANDLING
// FOREIGN KEY / PRIMARY KEY SYNTAX
// TYPES

interface Field {
  name: string
  type: string
  options: string[]
}

interface TableOptions {
  name: string
  fields: Field[]
}

export class Storage {
  private sqlLite = SQLite
  private dbName = 'LocalSmartWalletData'

  constructor() {
    this.sqlLite.enablePromise(true)
    // this.db.DEBUG(true)
  }

  private async getDbInstance() : Promise<any> {
    return await this.sqlLite.openDatabase({ name: this.dbName })
  }

  // ERROR ? 
  closeDB(db: any) : void {
    db.close()
  }

  async provisionTables() : Promise<void> {
    const tableData: TableOptions[] = [{
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
    }]

    const db = await this.getDbInstance()
    //TODO: error handling for opening DB
    const creationStatuses = await Promise.all(
      tableData.map(async t =>
        await this.createTable(t, db)
      )
    )

    const finished = creationStatuses.every(result => result)

    //TODO: better error handling here
    finished ? this.closeDB(db) : console.log ('error in provisioning database')
  }

  private async createTable(options : TableOptions, db: any) : Promise<boolean> {
    const query = this.assembleCreateTableQuery(options)
    return await this.executeQuery(db, query)
  }

  private assembleCreateTableQuery(options: TableOptions) : string {
    const { name, fields } = options
    const st = `CREATE TABLE IF NOT EXISTS ${name}`

    const fieldSt = fields.map(f => {
      const { name, type, options } = f
      const fieldOptions = options.join(' ')
      return `${name} ${type} ${fieldOptions}`
    }).join(', ')
    return `${st} (${fieldSt})`
  }

  private async executeQuery(db: any, query: string) : Promise<boolean> {
    const successCB = () => true
    const errorCB = (err: Error) => {
      throw new Error(`Query execution failed: ${err.message}`)
    }

    return await db.transaction((tx: any) => 
      tx.executeSql(query, errorCB, successCB)
    )
  }
}
