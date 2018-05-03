import * as MockDate from 'mockdate'
import { Storage }  from 'src/lib/storage'

describe('Storage lib', () => {
  let agent

  beforeEach(() => {
    agent = new Storage()
  })

  it('should attempt to provision tables', async () => {
    const mockExecQuery = agent.executeWriteQuery = jest.fn()
    const mockCloseDb = agent.closeDB = jest.fn().mockResolvedValue()

    const mockDbInstance = { transaction: jest.fn() }
    const mockGetDbInstnace = agent.getDbInstance = jest.fn()
      .mockResolvedValue(mockDbInstance)

    await agent.provisionTables()

    expect(mockExecQuery.mock.calls).toMatchSnapshot()
    expect(mockGetDbInstnace).toHaveBeenCalledTimes(1)
    expect(mockCloseDb).toHaveBeenCalledTimes(1)
  })

  it('should provide a db instance with foreign key enforcement', async () => {
    const mockOpenDb = jest.fn((dbOptions, successCB, errorCB) => {
      successCB(mockDbInstance)
    })

    const mockDbInstance = {
      executeSql: jest.fn((query, params, successCB, errorCB) => {
        successCB()
      })
    }

    agent.sqlLite.openDatabase = mockOpenDb
    await agent.getDbInstance()

    expect(mockDbInstance.executeSql.mock.calls).toMatchSnapshot()
    expect(mockOpenDb.mock.calls).toMatchSnapshot()
  })

  it('should attempt to close a db instance', async () => {
    const mockDb = {
      close: jest.fn((successCB, errorCB) => {
        successCB()
      })
    }
    
    await agent.closeDB(mockDb)
    expect(mockDb.close).toHaveBeenCalledTimes(1)
  })

  it('should attempt to add a persona', async () => {
    const mockGetDbInstnace = agent.getDbInstance = jest.fn()
      .mockResolvedValue('mocked')
    const mockExecuteWriteQuery = agent.executeWriteQuery = jest.fn()
    const mockCloseDb = agent.closeDB = jest.fn()

    await agent.addPersona({
      did: 'did:jolo:mock',
      controllingKey: 'mockEncryptedWif'
    })

    expect(mockGetDbInstnace).toHaveBeenCalledTimes(1)
    expect(mockExecuteWriteQuery.mock.calls).toMatchSnapshot()
    expect(mockCloseDb).toHaveBeenCalledTimes(1)
  })

  it('should attempt to add a master key', async () => {
    MockDate.set('1/1/2000')
    const mockGetDbInstnace = agent.getDbInstance = jest.fn()
      .mockResolvedValue('mocked')
    const mockExecuteWriteQuery = agent.executeWriteQuery = jest.fn()
    const mockCloseDb = agent.closeDB = jest.fn()

    await agent.addMasterKey('mockEntropy')

    expect(mockGetDbInstnace).toHaveBeenCalledTimes(1)
    expect(mockExecuteWriteQuery.mock.calls).toMatchSnapshot()
    expect(mockCloseDb).toHaveBeenCalledTimes(1)
    MockDate.reset()
  })

  it('should attempt to add a derived key', async () => {
    const mockGetDbInstnace = agent.getDbInstance = jest.fn()
      .mockResolvedValue('mocked')
    const mockExecuteWriteQuery = agent.executeWriteQuery = jest.fn()
    const mockCloseDb = agent.closeDB = jest.fn()

    await agent.addDerivedKey({
      encryptedWif: 'mockWif',
      path: "m/0/3'/0",
      entropySource: 'encEntropy',
      keyType: 'ECDSA'
    })

    expect(mockGetDbInstnace).toHaveBeenCalledTimes(1)
    expect(mockExecuteWriteQuery.mock.calls).toMatchSnapshot()
    expect(mockCloseDb).toHaveBeenCalledTimes(1)
  })

  it('should attempt to get all personas', async () => {
    const mockPersonas: ['did:jolo:first', 'did:jolo:second']

    const mockGetDbInstnace = agent.getDbInstance = jest.fn()
      .mockResolvedValue('mocked')
    const mockExecuteReadQuery = agent.executeReadQuery = jest.fn()
      .mockResolvedValue({raw: () => mockPersonas})

    const mockCloseDb = agent.closeDB = jest.fn()

    expect(await agent.getPersonas()).toBe(mockPersonas)
    expect(mockGetDbInstnace).toHaveBeenCalledTimes(1)
    expect(mockExecuteReadQuery.mock.calls).toMatchSnapshot()
    expect(mockCloseDb).toHaveBeenCalledTimes(1)
  })

  it('should attempt to execute read query', async () => {
    const mockResult = {
      rows: {
        raw: jest.fn()
      }
    }

    const mockTransaction = {
      executeSql: jest.fn((text, values, successCB, errorCB) => {
        successCB({}, mockResult)
      })
    }

    const mockDb = {
      readTransaction: jest.fn((toExecute, errorCB, successCB) => {
        toExecute(mockTransaction)
      })
    }

    const mockQuery = {
      text: 'SELECT * FROM Mock',
      values: []
    }

    expect(await agent.executeReadQuery(mockDb, mockQuery)).toBe(mockResult.rows)
    expect(mockTransaction.executeSql.mock.calls).toMatchSnapshot()
    expect(mockDb.readTransaction).toHaveBeenCalledTimes(1)
  })

  it('should attempt to execute write query', async () => {
    const mockTransaction = {
      executeSql: jest.fn()
    }

    const mockDb = {
      transaction: jest.fn((toExecute, errorCB, successCB) => {
        toExecute(mockTransaction)
        successCB()
      })
    }

    const mockQuery = {
      text: 'INSERT into MOCK VALUES(?)',
      values: ['mockValue']
    }

    await agent.executeWriteQuery(mockDb, mockQuery)
    expect(mockTransaction.executeSql.mock.calls).toMatchSnapshot()
    expect(mockDb.transaction).toHaveBeenCalledTimes(1)
  })

})
