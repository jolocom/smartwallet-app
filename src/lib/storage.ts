const SQLite = require('react-native-sqlite-storage')
import { dbHelper, TableOptions, AssembledQuery, DerivedKeyAttributes, PersonaAttributes } from 'src/lib/dbHelper'
import { Location, ResultSet, ResultSetRowList, Transaction, SQLiteDatabase } from 'react-native-sqlite-storage'

export interface StorageInterface {
  provisionTables: () => Promise<void>
  addPersona: (args: PersonaAttributes) => Promise<void>
  addMasterKey: (entropy: string) => Promise<void>
  addDerivedKey: (args: DerivedKeyAttributes) => Promise<void>
  getPersonas: () => Promise<PersonaAttributes[]> 
}

export class Storage implements StorageInterface {
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
        db.executeSql('PRAGMA foreign_keys = ON;', [], () => resolve(db), reject)
      }, reject)
    })
  }

  private async closeDB(db: SQLiteDatabase) : Promise<void> {
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

  async addPersona(args: PersonaAttributes) : Promise<void> {
    const db = await this.getDbInstance()
    const query = dbHelper.addPersonaQuery(args)
    await this.executeWriteTransaction(db, query)
    await this.closeDB(db)
  }

  async addMasterKey(entropy: string) : Promise<void> {
    const db = await this.getDbInstance()
    const query = dbHelper.addMasterKeyQuery(entropy)
    await this.executeWriteTransaction(db, query)
    await this.closeDB(db)
  }

  async addDerivedKey(args: DerivedKeyAttributes) : Promise<void> {
    const db = await this.getDbInstance()
    const query = dbHelper.addDerivedKeyQuery(args)
    await this.executeWriteTransaction(db, query)
    await this.closeDB(db)
  }

  async getPersonas() : Promise<PersonaAttributes[]> {
    interface ExtendedRowList extends ResultSetRowList {
      raw: () => PersonaAttributes[]
    }

    const db = await this.getDbInstance()
    const query = dbHelper.getPersonasQuery()
    const rows = await this.executeReadTransaction(db, query) as ExtendedRowList
    await this.closeDB(db)
    return rows.raw()
  }

  private async createTable(options : TableOptions, db: SQLiteDatabase) : Promise<void> {
    const query = dbHelper.createTableQuery(options)
    await this.executeWriteTransaction(db, query)
  }

  private async executeReadTransaction(db: SQLiteDatabase, query: AssembledQuery) : Promise<ResultSetRowList> {
    const { text, values } = query

    return new Promise<ResultSetRowList>((resolve, reject) =>
      db.readTransaction((tx: Transaction) => {
        return tx.executeSql(text, values, (tx: Transaction, result: ResultSet) => {
          return resolve(result.rows)
        }, reject)
      }, reject)
    )
  }

  private async executeWriteTransaction(db: SQLiteDatabase, query: AssembledQuery) : Promise<void> {
    const { text, values } = query

    return new Promise<void>((resolve, reject) => 
      db.transaction((tx: Transaction) => {
        return tx.executeSql(text, values)
      }, reject, () => resolve())
    )
  }
}
