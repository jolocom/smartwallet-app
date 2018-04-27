import { Storage, dbHelper}  from 'src/lib/storage'
import data from './data/storageTestData'

describe('Storage lib', () => {
  let StorageAgent

  beforeEach(() => {
    StorageAgent = Storage
  })

  it('should initialize correctly', () => {
    const mock = StorageAgent.prototype.enablePromise = jest.fn()

    new StorageAgent()
    expect(mock).toHaveBeenCalledTimes(1)
  })

  it('should attempt to provision tables', async () => {
    const agent = new StorageAgent()

    const mockExecQuery = agent.executeQuery = jest.fn()
    const mockCloseDb = agent.closeDB = jest.fn().mockResolvedValue()

    const mockDbInstance = { transaction: jest.fn() }
    const mockGetDbInstnace = agent.getDbInstance = jest.fn()
      .mockResolvedValue(mockDbInstance)

    await agent.provisionTables()

    expect(mockExecQuery.mock.calls).toMatchSnapshot()
    expect(mockGetDbInstnace).toHaveBeenCalledTimes(1)
    expect(mockCloseDb).toHaveBeenCalledTimes(1)
  })
})

describe('Storage Lib | dbHelper', () => {
  it('should correctly assemble table creation query', () => {
    const { personasTableInfo, keysTableInfo } = data
    expect(dbHelper.assembleCreateTableQuery(personasTableInfo)).toMatchSnapshot()
    expect(dbHelper.assembleCreateTableQuery(keysTableInfo)).toMatchSnapshot()
  }) 
})
