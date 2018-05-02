const SQLite = require('react-native-sqlite-storage')
import { dbHelper, TableOptions, AssembledQuery, DerivedKeyOptions, PersonaOptions } from 'src/lib/dbHelper'
import { Location, ResultSet, ResultSetRowList, Transaction, SQLiteDatabase } from 'react-native-sqlite-storage'

export class Storage {
  private sqlLite = SQLite
  private dbName = 'LocalSmartWalletData'
  private location: Location = 'default'

  private async getDbInstance() : Promise<SQLiteDatabase> {
    const dbOptions = {
      name: this.dbName,
      location: this.location
    }

    return new Promise<SQLiteDatabase>((resolve, reject) => {
      this.sqlLite.openDatabase(dbOptions, (db: SQLiteDatabase) => {
        db.executeSql('PRAGMA foreign_keys = ON;', [], () => resolve(db))
      }, reject)
    })
  }

  async closeDB(db: SQLiteDatabase) : Promise<void> {
    return new Promise<void>((resolve, reject) => {
      return db.close(resolve, reject)
    })
  }

  async provisionTables() : Promise<void> {
    const tableData: TableOptions[] = dbHelper.defaultTables
    const db = await this.getDbInstance()
    await Promise.all(tableData.map(async t => await this.createTable(t, db)))
    await this.closeDB(db)
  }

  async addPersona(args: PersonaOptions) : Promise<void> {
    const db = await this.getDbInstance()
    const query = dbHelper.addPersonaQuery(args)
    await this.executeWriteQuery(db, query)
    await this.closeDB(db)
  }

  async addMasterKey(entropy: string) : Promise<void> {
    const db = await this.getDbInstance()
    const query = dbHelper.addMasterKeyQuery(entropy)
    await this.executeWriteQuery(db, query)
    await this.closeDB(db)
  }

  async addDerivedKey(args: DerivedKeyOptions) : Promise<void> {
    const db = await this.getDbInstance()
    const query = dbHelper.addDerivedKeyQuery(args)
    await this.executeWriteQuery(db, query)
    await this.closeDB(db)
  }

  async getPersonas() : Promise<PersonaOptions[]> {
    interface ExtendedRowList extends ResultSetRowList {
      raw: () => PersonaOptions[]
    }

    const db = await this.getDbInstance()
    const query = dbHelper.getPersonasQuery()
    const rows = await this.executeReadQuery(db, query) as ExtendedRowList
    return rows.raw()
  }

  private async createTable(options : TableOptions, db: SQLiteDatabase) : Promise<void> {
    const query = dbHelper.createTableQuery(options)
    await this.executeWriteQuery(db, query)
  }

  private async executeReadQuery(db: SQLiteDatabase, query: AssembledQuery) : Promise<ResultSetRowList> {
    const { text, values } = query

    return new Promise<ResultSetRowList>((resolve, reject) =>
      db.readTransaction((tx: Transaction) => {
        return tx.executeSql(text, values, (tx: Transaction, result: ResultSet) => {
          return resolve(result.rows)
        })
      }, reject)
    )
  }

  private async executeWriteQuery(db: SQLiteDatabase, query: AssembledQuery) : Promise<void> {
    const { text, values } = query

    return new Promise<void>((resolve, reject) => 
      db.transaction((tx: Transaction) => {
        return tx.executeSql(text, values)
      }, reject, () => resolve())
    )
  }
}
