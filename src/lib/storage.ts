const SQLite = require('react-native-sqlite-storage')
import { dbHelper, TableOptions } from 'src/lib/dbHelper'
import { Location, ResultSet, Transaction } from 'react-native-sqlite-storage'

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
    this.enablePromise()
    this.sqlLite.DEBUG(true)
  }

  private enablePromise() : void {
    this.sqlLite.enablePromise(true)
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
