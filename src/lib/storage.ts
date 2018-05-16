const SQLite = require('react-native-sqlite-storage')
import { dbHelper, TableOptions } from 'src/lib/dbHelper'
import { Location, ResultSet, Transaction } from 'react-native-sqlite-storage'

interface AsyncTransaction {
  executeSql: (query: string, args?: any[]) => Promise<[Transaction, ResultSet]>
}

interface SQLiteDatabase {
  enablePromise: (flag: boolean) => void
  DEBUG: (flag: boolean) => void
  openDatabase: (args: {name: string, location: Location}) => Promise<SQLiteDatabase>
  executeSql: (query: string) => Promise<void>
  executeWriteQuery: (db: SQLiteDatabase, query: string) => Promise<void>
  close: (successCB: Function, errCB: Function) => Promise<void>
  transaction: (tx: Function) => Promise<void>
}

export class Storage {
  private sqlLite: SQLiteDatabase = SQLite
  private dbName = 'LocalSmartWalletData'
  private location: Location = 'default'

  constructor() {
    this.enablePromise()
    this.sqlLite.DEBUG(true)
  }

  private enablePromise() : void {
    this.sqlLite.enablePromise(true)
  }

  private async getDbInstance() : Promise<SQLiteDatabase> {
    const db = await this.sqlLite.openDatabase({
      name: this.dbName,
      location: this.location
    })

    await db.executeSql('PRAGMA foreign_keys = ON;')
    return db
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

  async addPersona(args: {did: string, controllingKey: string}) {
    const db = await this.getDbInstance()
    const query = dbHelper.addPersonaQuery(args)
    await this.executeWriteQuery(db, query)
    await this.closeDB(db)
  }

  async addMasterKey(entropy: string) {
    const db = await this.getDbInstance()
    const query = dbHelper.addMasterKeyQuery(entropy)
    await this.executeWriteQuery(db, query)
    await this.closeDB(db)
  }

  async addDerivedKey(args: { encryptedWif: string, path: string, entropySource: string, keyType: string }) {
    const db = await this.getDbInstance()
    const query = dbHelper.addDerivedKeyQuery(args)
    await this.executeWriteQuery(db, query)
    await this.closeDB(db)
  }

  async getPersonas() {
    const db = await this.getDbInstance()
    const query = 'select * from Keys'
    const res = await this.executeReadQueryAlt(db, query)
    return res.rows
  }

  private async createTable(options : TableOptions, db: SQLiteDatabase) : Promise<void> {
    const query = dbHelper.createTableQuery(options)
    await this.executeWriteQuery(db, query)
  }

  private async executeReadQueryAlt(db: SQLiteDatabase, query: string) : Promise<ResultSet> {
    return new Promise<ResultSet>((resolve, reject) =>
      db.transaction(async (tx: AsyncTransaction) => {
        const result = await tx.executeSql(query, [])
        return resolve(result[1])
      })
    )
  }

  private async executeWriteQuery(db: SQLiteDatabase, query: string) : Promise<void> {
    return await db.transaction(async (tx: AsyncTransaction) => 
      tx.executeSql(query, [])
    )
  }
}
