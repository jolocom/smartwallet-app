const SQLite = require('react-native-sqlite-storage')
import { dbHelper, TableOptions } from 'src/lib/dbHelper'
import { Location, ResultSet, Transaction } from 'react-native-sqlite-storage'

interface AsyncTransaction {
  executeSql: (query: string, args?: any[]) => Promise<{result: ResultSet, transaction: Transaction}>
}

interface SQLiteDatabase {
  enablePromise: (flag: boolean) => void
  DEBUG: (flag: boolean) => void
  openDatabase: (args: {name: string, location: Location}) => Promise<SQLiteDatabase>
  executeSql: (query: string) => Promise<void>
  executeQuery: (db: SQLiteDatabase, query: string) => Promise<void>
  close: (successCB: Function, errCB: Function) => Promise<void>
  transaction: (tx: Function) => Promise<ResultSet>
}

export class Storage {
  private sqlLite: SQLiteDatabase = SQLite
  private dbName = 'LocalSmartWalletData'
  private location: Location = 'default'

  constructor() {
    this.enablePromise()
    // this.sqlLite.DEBUG(false)
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

  async addPersona(args: {did: string, controllingKey: number}) {
    const db = await this.getDbInstance()
    const query = dbHelper.addPersonaQuery(args)
    await this.executeQuery(db, query)
    await this.closeDB(db)
  }

  async addMasterKey(entropy: string) {
    const db = await this.getDbInstance()
    const query = dbHelper.addMasterKeyQuery(entropy)
    await this.executeQuery(db, query)
    await this.closeDB(db)
  }

  async addDerivedKey(args: { encryptedWif: string, path: string, entropySource: number, keyType: string }) {
    const db = await this.getDbInstance()
    const query = dbHelper.addDerivedKeyQuery(args)
    await this.executeQuery(db, query)
    await this.closeDB(db)
  }

  private async createTable(options : TableOptions, db: SQLiteDatabase) : Promise<void> {
    const query = dbHelper.createTableQuery(options)
    await this.executeQuery(db, query)
  }

  private async executeQuery(db: SQLiteDatabase, query: string) : Promise<ResultSet> {
    return await db.transaction(async (tx: AsyncTransaction) => {
      const response = await tx.executeSql(query, [])
      return response.result
    })
  }
}
