
import { Storage } from 'src/lib/storage'
import data from './data/storageTestData'

describe.only('Storage lib', () => {
  let database

  beforeEach(() => {
    database = new Storage()
    const mockTransaction= jest.fn().mockResolvedValue(Promise.resolve(true))
    database.db.transaction = mockTransaction
    const mockOpenDB = jest.fn().mockResolvedValue(Promise.resolve(true))
    database.db.openDatabase = mockOpenDB
  })

  it('should contain the correct databasename', () => {
    expect(database.dbName).toBe('LocalSmartWalletData')
    expect(database.db).toBeDefined()
  })

   it('should correctly assemble table queries', () => {
    const result = database.assembleCreateTableQuery(data.expectedPersonasTableOptions)
    const result2 = database.assembleCreateTableQuery(data.expectedKeysTableOptions)
    expect(result).toEqual(data.expectedPersonasQuery)
    expect(result2).toEqual(data.expectedKeysQuery)
  }) 
  
  it('should correctly return from table queries', async () => {
    const result = await database.executeCreateTableQuery(data.expectedPersonasQuery)
    expect(result).toBe(true)
  })
})