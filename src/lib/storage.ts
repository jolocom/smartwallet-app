const SQLite = require('react-native-sqlite-storage')

export class Storage {
  private db = SQLite
  private dbName = 'LocalSmartWalletData'

  constructor() {
    this.db.enablePromise(true)
  }

  async storeData() {

  }

  private async checkIfDbExists() : Promise<boolean>{
    return false
  }

  async createDb() : Promise<boolean> {
    const result = await this.db.openDatabase({ name: this.dbName })

    await result.transaction(tx => {
      tx.executeSql('CREATE TABLE IF NOT EXISTS Version5( version_id INTEGER PRIMARY KEY NOT NULL); ')
    })

    await result.close()
    return true
  }

  async getData() {

  }

  async getPersonas() {

  }

  async getAllAttributes(did: string) {

  }

  async getAttributeByType(did: string, type: string) {

  }

  async getAllVerifications(did: string) {

  }

  async getVerificationsByAttribute(did: string, attribute: string) {

  }

  async getVerificationsByType(did : string, attribute: string) {

  }
}