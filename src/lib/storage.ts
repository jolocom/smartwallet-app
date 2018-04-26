const SQLite = require('react-native-sqlite-storage')

// TODO THROW ERRORS! & ERROR HANDLING
// FOREIGN KEY / PRIMARY KEY SYNTAX
// TYPES

interface Field {
  name: string
  type: string
  options?: string[]
}

interface TableOptions {
  name: string
  fields: Field[]
}

export class Storage {
  private db = SQLite
  private dbName = 'LocalSmartWalletData'

  constructor() {
    this.db.enablePromise(true)
    this.db.DEBUG(true)
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
        type: 'INTEGER'
      }, {
        name: 'FOREIGN KEY(controllingKey)',
        type: 'REFERENCES Keys(id)'
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
        type: 'INTEGER'
      }, {
        name: 'algorithm',
        type: 'TEXT',
        options: ['NOT NULL']
      }, {
        name: 'FOREIGN KEY(entropySource)',
        type: 'REFERENCES MasterKeys(id)'
      }]
    }]

    this.db = await this.getDbInstance()
    //TODO: error handling for opening DB
    const finalResults = await Promise.all(
      tableData.map(async t => {
        return await this.createTable(t)
      })
    )
    const finished = finalResults.every(result => result)
    //TODO: better error handling here
    finished ? this.closeDB() : console.log ('error in provisioning database')
  }

  private async createTable(options : TableOptions) : Promise<boolean> {
    const query = this.assembleCreateTableQuery(options)
    return await this.executeCreateTableQuery(this.db, query)
  }

  private assembleCreateTableQuery(options: TableOptions) : string {
    const { name, fields } = options
    const st = `CREATE TABLE IF NOT EXISTS ${name}`
    const fieldSt = fields.map(f => {
      const { name, type, options } = f
      let fieldOptions = ''
      if (options) {
        fieldOptions = options.join(' ')
      }

      return `${name} ${type} ${fieldOptions}`
    }).join(', ')
    return `${st} (${fieldSt})`
  }

  private async executeCreateTableQuery(db: any, query: any) : Promise<boolean> {
    return await this.db.transaction((tx: any) => tx.executeSql(query, this.errorCB, this.querySuccess))
  }

  private async getDbInstance() : Promise<void>{
    return await this.db.openDatabase({ name: this.dbName }, this.querySuccess, this.errorCB)
  }

  private errorCB (error: any) : Error {
    //TODO: better error handling here
    return error
  }

  private querySuccess() : boolean {
    return true
  }

  closeDB() : void {
    this.db.close()
  }
}